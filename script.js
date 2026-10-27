let qrStyling = null;
let activeCategory = 'text';

document.addEventListener('DOMContentLoaded', () => {
    selectCategory('text');
});

// Dropdown click handler
function toggleDropdown(event, dropdownId) {
    event.stopPropagation();
    const dropdown = document.getElementById(dropdownId);
    const isOpen = dropdown.classList.contains('show');
    
    closeAllDropdowns();

    if (!isOpen) {
        dropdown.classList.add('show');
    }
}

function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.remove('show');
    });
}

document.addEventListener('click', () => {
    closeAllDropdowns();
});

function selectCategory(cat) {
    activeCategory = cat;
    closeAllDropdowns();

    // Update Sidebar Active state
    ['text', 'vcard', 'wifi'].forEach(id => {
        const btn = document.getElementById(`btn-cat-${id}`);
        if (btn) {
            if (id === cat) {
                btn.className = 'w-full flex items-center space-x-3 p-3 rounded-xl text-left text-sm font-semibold bg-white/10 text-emerald-300 transition-all';
            } else {
                btn.className = 'w-full flex items-center space-x-3 p-3 rounded-xl text-left text-sm font-semibold text-gray-300 hover:bg-white/5 transition-all';
            }
        }
    });

    const titleEl = document.getElementById('active-option-title');
    const area = document.getElementById('dynamic-inputs-area');
    area.innerHTML = '';

    if (cat === 'text') {
        titleEl.innerText = 'Enter Web URL or Text';
        area.innerHTML = `<textarea id="input-text" oninput="renderQR()" rows="3" placeholder="https://example.com" class="w-full bg-gray-900 border border-white/20 p-3 rounded-xl text-xs text-white outline-none focus:border-emerald-500">https://github.com/grow4u555-ui/qrcode</textarea>`;
    } else if (cat === 'vcard') {
        titleEl.innerText = 'Create Contact Card (vCard)';
        area.innerHTML = `
            <input type="text" id="vcard-name" oninput="renderQR()" placeholder="Full Name" value="Surajit" class="w-full bg-gray-900 border border-white/20 p-2.5 rounded-xl text-xs text-white outline-none mb-2 focus:border-emerald-500">
            <input type="text" id="vcard-phone" oninput="renderQR()" placeholder="Phone Number" value="+919876543210" class="w-full bg-gray-900 border border-white/20 p-2.5 rounded-xl text-xs text-white outline-none focus:border-emerald-500">
        `;
    } else if (cat === 'wifi') {
        titleEl.innerText = 'Wi-Fi Network Credentials';
        area.innerHTML = `
            <input type="text" id="wifi-ssid" oninput="renderQR()" placeholder="Network SSID" value="HomeNetwork" class="w-full bg-gray-900 border border-white/20 p-2.5 rounded-xl text-xs text-white outline-none mb-2 focus:border-emerald-500">
            <input type="password" id="wifi-pass" oninput="renderQR()" placeholder="Password" value="secret123" class="w-full bg-gray-900 border border-white/20 p-2.5 rounded-xl text-xs text-white outline-none focus:border-emerald-500">
        `;
    }

    renderQR();
}

function getPayload() {
    if (activeCategory === 'text') {
        return document.getElementById('input-text')?.value || 'https://github.com/grow4u555-ui/qrcode';
    } else if (activeCategory === 'vcard') {
        const n = document.getElementById('vcard-name')?.value || '';
        const p = document.getElementById('vcard-phone')?.value || '';
        return `BEGIN:VCARD\nVERSION:3.0\nN:${n}\nTEL:${p}\nEND:VCARD`;
    } else if (activeCategory === 'wifi') {
        const s = document.getElementById('wifi-ssid')?.value || '';
        const p = document.getElementById('wifi-pass')?.value || '';
        return `WIFI:S:${s};T:WPA;P:${p};;`;
    }
    return 'Surajit QR Code Helper';
}

function renderQR() {
    const target = document.getElementById('qr-code-canvas');
    if (!target) return;
    target.innerHTML = '';

    const fg = document.getElementById('fg-color')?.value || '#000000';
    const bg = document.getElementById('bg-color')?.value || '#ffffff';
    const payload = getPayload();

    qrStyling = new QRCodeStyling({
        width: 180,
        height: 180,
        type: 'canvas',
        data: payload,
        dotsOptions: { color: fg, type: 'rounded' },
        backgroundOptions: { color: bg }
    });

    qrStyling.append(target);
}

function downloadQR(ext) {
    if (qrStyling) {
        qrStyling.download({ name: 'surajit-qr-code', extension: ext });
    }
}

function toggleScannerModal() {
    const modal = document.getElementById('scanner-modal');
    modal.classList.toggle('hidden');
}
