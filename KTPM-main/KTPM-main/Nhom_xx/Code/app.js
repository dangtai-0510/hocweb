const DATA_URL = "data.json";
const CUSTOM_KEY = "devshortcuts_custom";

let allShortcuts = [];

// Các biến trạng thái cho tính năng Edit
let isEditMode = false;
let selectedIds = [];
let editingShortcutId = null;

/* ================= LOAD DATA ================= */
async function loadData() {
  const res = await fetch(DATA_URL);
  const json = await res.json();
  
  // Cấp ID ảo cho các phím tắt mặc định (nếu chưa có) để dễ thao tác Update/Delete
  allShortcuts = json.shortcuts.map((s, index) => ({
    ...s,
    id: s.id || `default_${index}`
  }));

  const custom = getCustomShortcuts();
  allShortcuts = [...allShortcuts, ...custom];

  populateFilters();
  renderCards(allShortcuts);
}

function getCustomShortcuts() {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCustomShortcut(sc) {
  const custom = getCustomShortcuts();

  const isDuplicate = allShortcuts.some(
    s =>
      s.software.trim().toLowerCase() === sc.software.trim().toLowerCase() &&
      s.keys.trim().toLowerCase() === sc.keys.trim().toLowerCase()
  );

  if (isDuplicate)
    return { error: "Phím tắt này đã tồn tại trong danh sách!" };

  sc.id = Date.now();
  sc.isCustom = true;

  custom.push(sc);
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(custom));

  return { success: true, data: sc };
}

function deleteCustomShortcut(id) {
  let custom = getCustomShortcuts();
  custom = custom.filter(s => String(s.id) !== String(id));
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(custom));

  allShortcuts = allShortcuts.filter(s => String(s.id) !== String(id));
  filterAndRender();
}

/* ================= FILTERS ================= */
function populateFilters() {
  const softwareSet = [...new Set(allShortcuts.map(s => s.software))].sort();
  const osSet = [...new Set(allShortcuts.map(s => s.os))].sort();

  const swFilter = document.getElementById("softwareFilter");
  const osFilter = document.getElementById("osFilter");

  swFilter.innerHTML = `<option value="">Tất cả phần mềm</option>`;
  osFilter.innerHTML = `<option value="">Tất cả hệ điều hành</option>`;

  softwareSet.forEach(sw => {
    const opt = document.createElement("option");
    opt.value = sw;
    opt.textContent = sw;
    swFilter.appendChild(opt);
  });

  osSet.forEach(os => {
    const opt = document.createElement("option");
    opt.value = os;
    opt.textContent = os;
    osFilter.appendChild(opt);
  });
}

/* ================= HIGHLIGHT ================= */
function highlight(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

/* ================= RENDER ================= */
function renderCards(list) {
  const grid = document.getElementById("shortcutGrid");
  const noResult = document.getElementById("noResult");
  const meta = document.getElementById("resultsMeta");
  const query = document.getElementById("searchInput").value.trim();

  grid.innerHTML = "";

  if (list.length === 0) {
    noResult.classList.remove("hidden");
    meta.textContent = "";
    return;
  }

  noResult.classList.add("hidden");
  meta.textContent = `Hiển thị ${list.length} phím tắt`;

  list.forEach(sc => {
    const card = document.createElement("div");
    
    // Thêm class xử lý chế độ edit và đang chọn
    const isSelected = selectedIds.includes(String(sc.id));
    card.className = `card ${isEditMode ? "edit-mode" : ""} ${isSelected ? "selected-card" : ""}`;
    card.dataset.id = sc.id;

    const keyParts = sc.keys.split(/\s*\+\s*/);
    const keyHTML = keyParts
      .map(
        (k, i) =>
          `<span class="key-badge">${highlight(
            k.trim(),
            query
          )}</span>${
            i < keyParts.length - 1
              ? '<span class="key-plus">+</span>'
              : ""
          }`
      )
      .join("");

    card.innerHTML = `
      <div class="card-checkbox ${isSelected ? "selected" : ""}" data-id="${sc.id}"></div>
      ${sc.isCustom ? '<span class="card-custom-badge">✦ Tùy chỉnh</span>' : ""}
      ${
        sc.isCustom && !isEditMode
          ? `<button class="delete-btn" data-id="${sc.id}">✕</button>`
          : ""
      }
      <span class="card-software ${
        sc.isCustom ? "custom-tag" : ""
      }">${highlight(sc.software, query)}</span>
      <div class="card-action">${highlight(sc.action, query)}</div>
      <div class="card-keys">${keyHTML}</div>
      <div class="card-os">🖥 ${sc.os}</div>
    `;

    grid.appendChild(card);
  });
}

/* ================= FILTER + SORT ================= */
function filterAndRender() {
  const query = document
    .getElementById("searchInput")
    .value.trim()
    .toLowerCase();
  const sw = document.getElementById("softwareFilter").value;
  const os = document.getElementById("osFilter").value;
  const sort = document.getElementById("sortFilter")?.value;

  let result = allShortcuts;

  if (query) {
    result = result.filter(
      s =>
        s.action.toLowerCase().includes(query) ||
        s.keys.toLowerCase().includes(query) ||
        s.software.toLowerCase().includes(query)
    );
  }

  if (sw) result = result.filter(s => s.software === sw);
  if (os) result = result.filter(s => s.os === os);

  if (sort === "software") {
    result = [...result].sort((a, b) =>
      a.software.localeCompare(b.software)
    );
  }

  if (sort === "action") {
    result = [...result].sort((a, b) =>
      a.action.localeCompare(b.action)
    );
  }

  renderCards(result);
}

/* ================= EVENTS ================= */

// Search debounce
let debounceTimer;
document.getElementById("searchInput").addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(filterAndRender, 200);
});

// Filters
document
  .getElementById("softwareFilter")
  .addEventListener("change", filterAndRender);
document
  .getElementById("osFilter")
  .addEventListener("change", filterAndRender);
document
  .getElementById("sortFilter")
  ?.addEventListener("change", filterAndRender);

// Delete button (Nút xóa đơn lẻ)
document.addEventListener("click", e => {
  if (e.target.classList.contains("delete-btn")) {
    deleteCustomShortcut(e.target.dataset.id);
  }
});

/* ================= MODAL ADD/UPDATE ================= */
function openAddModal() {
  document.getElementById("modalOverlay").classList.remove("hidden");
  document.getElementById("fSoftware").focus();
}

function closeAddModal() {
  document.getElementById("modalOverlay").classList.add("hidden");
  document.getElementById("addForm").reset();
  document.getElementById("formError").classList.add("hidden");
}

document.getElementById("fabAdd").addEventListener("click", () => {
  editingShortcutId = null;
  document.querySelector("#modalOverlay h2").textContent = "Thêm Phím Tắt Mới";
  openAddModal();
});

document.getElementById("btnCancel").addEventListener("click", () => {
  editingShortcutId = null;
  document.querySelector("#modalOverlay h2").textContent = "Thêm Phím Tắt Mới";
  closeAddModal();
});

document
  .getElementById("btnAddFromNoResult")
  .addEventListener("click", () => {
    editingShortcutId = null;
    document.querySelector("#modalOverlay h2").textContent = "Thêm Phím Tắt Mới";
    openAddModal();
  });

document
  .getElementById("modalOverlay")
  .addEventListener("click", e => {
    if (e.target === document.getElementById("modalOverlay")) {
      editingShortcutId = null;
      document.querySelector("#modalOverlay h2").textContent = "Thêm Phím Tắt Mới";
      closeAddModal();
    }
  });

document.getElementById("addForm").addEventListener("submit", e => {
  e.preventDefault();

  const sc = {
    software: document.getElementById("fSoftware").value.trim(),
    action: document.getElementById("fAction").value.trim(),
    keys: document.getElementById("fKeys").value.trim(),
    os: document.getElementById("fOs").value
  };

  // Logic cập nhật phím tắt đang chọn
  if (editingShortcutId) {
    sc.id = editingShortcutId;
    sc.isCustom = true; 
    
    // Cập nhật mảng tổng
    const index = allShortcuts.findIndex(s => String(s.id) === String(editingShortcutId));
    if (index !== -1) allShortcuts[index] = sc;
    
    // Cập nhật localStorage
    let custom = getCustomShortcuts();
    const customIndex = custom.findIndex(s => String(s.id) === String(editingShortcutId));
    if (customIndex !== -1) {
      custom[customIndex] = sc;
    } else {
      custom.push(sc); 
    }
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(custom));
    
    editingShortcutId = null;
    document.querySelector("#modalOverlay h2").textContent = "Thêm Phím Tắt Mới";
    toggleEditMode(); // Tắt chế độ edit sau khi lưu
  } 
  // Logic thêm mới
  else {
    const result = saveCustomShortcut(sc);

    if (result.error) {
      const err = document.getElementById("formError");
      err.textContent = result.error;
      err.classList.remove("hidden");
      return;
    }

    allShortcuts.push(result.data);
  }

  populateFilters();
  filterAndRender();
  closeAddModal();
});

/* ================= EDIT MODE LOGIC ================= */
const fabEdit = document.getElementById("fabEdit");
const editActionBar = document.getElementById("editActionBar");
const btnCancelEdit = document.getElementById("btnCancelEdit");
const btnDeleteSelected = document.getElementById("btnDeleteSelected");
const btnUpdateSelected = document.getElementById("btnUpdateSelected");

function toggleEditMode() {
  isEditMode = !isEditMode;
  selectedIds = [];
  updateActionBarVisibility();
  filterAndRender(); 
}

function updateActionBarVisibility() {
  if (isEditMode) {
    editActionBar.classList.remove("hidden");
    document.getElementById("selectedCount").textContent = `Đã chọn ${selectedIds.length}`;
    
    btnUpdateSelected.style.display = selectedIds.length === 1 ? "inline-block" : "none";
    btnDeleteSelected.style.display = selectedIds.length > 0 ? "inline-block" : "none";
  } else {
    editActionBar.classList.add("hidden");
  }
}

// Bật tắt chế độ Edit
if(fabEdit) fabEdit.addEventListener("click", toggleEditMode);
if(btnCancelEdit) btnCancelEdit.addEventListener("click", toggleEditMode);

// Xử lý click chọn thẻ (Card)
document.addEventListener("click", e => {
  if (isEditMode) {
    const card = e.target.closest(".card");
    if (card && !e.target.classList.contains("delete-btn")) {
      const id = String(card.dataset.id);
      
      if (selectedIds.includes(id)) {
        selectedIds = selectedIds.filter(i => i !== id);
      } else {
        selectedIds.push(id);
      }
      
      updateActionBarVisibility();
      filterAndRender();
    }
  }
});

// Chức năng XÓA NHIỀU
if(btnDeleteSelected) {
  btnDeleteSelected.addEventListener("click", () => {
    if (confirm(`Bạn có chắc muốn xóa ${selectedIds.length} phím tắt đã chọn?`)) {
      let custom = getCustomShortcuts();
      
      selectedIds.forEach(id => {
        custom = custom.filter(s => String(s.id) !== id);
        allShortcuts = allShortcuts.filter(s => String(s.id) !== id);
      });
      
      localStorage.setItem(CUSTOM_KEY, JSON.stringify(custom));
      selectedIds = [];
      toggleEditMode();
      populateFilters();
    }
  });
}

// Chức năng CẬP NHẬT
if(btnUpdateSelected) {
  btnUpdateSelected.addEventListener("click", () => {
    const targetId = selectedIds[0];
    const sc = allShortcuts.find(s => String(s.id) === targetId);
    
    if (sc) {
      editingShortcutId = targetId;
      
      document.getElementById("fSoftware").value = sc.software;
      document.getElementById("fAction").value = sc.action;
      document.getElementById("fKeys").value = sc.keys;
      document.getElementById("fOs").value = sc.os;
      
      document.querySelector("#modalOverlay h2").textContent = "Cập nhật Phím Tắt";
      document.getElementById("modalOverlay").classList.remove("hidden");
    }
  });
}

/* ================= HELP MODAL ================= */
const helpBtn = document.getElementById("helpBtn");
const helpOverlay = document.getElementById("helpOverlay");
const helpClose = document.getElementById("helpClose");

helpBtn.addEventListener("click", () =>
  helpOverlay.classList.remove("hidden")
);
helpClose.addEventListener("click", () =>
  helpOverlay.classList.add("hidden")
);
helpOverlay.addEventListener("click", e => {
  if (e.target === helpOverlay)
    helpOverlay.classList.add("hidden");
});

/* ================= ESC CLOSE ================= */
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    helpOverlay.classList.add("hidden");
    document.getElementById("modalOverlay").classList.add("hidden");
    if(isEditMode) toggleEditMode(); // Nhấn ESC cũng thoát Edit mode
  }
});

/* ================= START ================= */
loadData();