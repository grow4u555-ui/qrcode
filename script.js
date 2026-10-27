let qrStyling = null;
let activeCategoryGroup = 'communication';
let activeOption = 'text';
let uploadedLogoBase64 = null;

// Categories definition mapped to your screenshots
const categoriesData = {
    communication: [
        { id: 'text', name: 'Text / URL', icon: 'fa-align-left', color: 'text-purple-400' },
        { id: 'vcard', name: 'vCard', icon: 'fa-address-card', color: 'text-emerald-400' },
        { id: 'email', name: 'Email', icon: 'fa-envelope', color: 'text-red-400' },
        { id: 'sms', name: 'SMS', icon: 'fa-comment-sms', color: 'text-amber-400' },
        { id: 'phone', name: 'Phone', icon: 'fa-phone', color: 'text-blue-400' },
        { id: 'whatsapp', name: 'WhatsApp', icon: 'fa-whatsapp', color: 'text-green-400', isBrand: true },
        { id: 'telegram', name: 'Telegram', icon: 'fa-telegram', color: 'text-sky-400', isBrand: true },
        { id: 'wechat', name: 'WeChat', icon: 'fa-weixin', color: 'text-emerald-500', isBrand: true },
        { id: 'discord', name: 'Discord', icon: 'fa-discord', color: 'text-indigo-400', isBrand: true }
    ],
    social: [
        { id: 'instagram', name: 'Instagram', icon: 'fa-instagram', color: 'text-pink-400', isBrand: true },
        { id: 'facebook', name: 'Facebook', icon: 'fa-facebook', color: 'text-blue-500', isBrand: true },
        { id: 'youtube', name: 'YouTube', icon: 'fa-youtube', color: 'text-red-500', isBrand: true }
    ],
    files: [
        { id: 'pdf', name: 'PDF File', icon: 'fa-file-pdf', color: 'text-red-400' },
        { id: 'image', name: 'Images', icon: 'fa-file-image', color: 'text-purple-400' }
    ],
    business: [
        { id: 'wifi', name: 'Wi-Fi', icon: 'fa-wifi', color: 'text-cyan-400' },
        { id: 'location', name: 'Location', icon: 'fa-location-dot', color: 'text-rose-400' }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    switchCategoryGroup('communication');
});

function switchCategoryGroup(groupKey) {
    activeCategoryGroup = groupKey;
    
    // Sidebar highlight
    document.querySelectorAll('.cat-group-btn').forEach(btn => {
        btn.className = 'cat-group-btn w-full flex items-center justify-between p-3 rounded-xl text-left text-sm font-semibold text-slate-300 hover:bg-white/5 transition-all';
    });
    const activeGroupBtn = document.getElementById(`cat-btn-${groupKey}`);
    if (activeGroupBtn) {
        activeGroupBtn.className = 'cat-group-btn w-full flex items-center justify-between p-3 rounded-xl text-left text-sm font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-all';
    }

    renderSubOptions();
}

function renderSubOptions() {
    const container = document.getElementById('sub-options-container');
    container.innerHTML = '';

    const list = categoriesData[activeCategoryGroup] || [];
    list.forEach((opt, idx) => {
        if (idx === 0) activeOption = opt.id;

        const card = document.createElement('button');
        card.onclick = () => selectOption(opt.id, opt.name);
        const fontClass = opt.isBrand ? 'fa-brands' : 'fa-solid';
        
        card.className = `p-3 rounded-xl glass-card flex items-center space-x-2.5 text-xs font-semibold hover:border-purple-500/40 transition-all text-left`;
        card.innerHTML = `
            <i class="${fontClass} ${opt.icon} ${opt.color} text-base"></i>
            <span class="text-slate-200">${opt.name}</span>
        `;
        container.appendChild(card);
    });

    selectOption(list[0]?.id || 'text', list[0]?.name || 'Text / URL');
}

function selectOption(optId, optName) {
    activeOption = optId;
    document.getElementById('active-option-title').innerText = optName;

    const area = document.getElementById('dynamic-inputs-area');
    area.innerHTML = '';

    if (optId === 'text') {
        area.innerHTML = `<textarea id="input-text" oninput="renderQR()" rows="3" placeholder="Enter URL or text..." class="w-full glass-input p-3 rounded-xl text-xs">https://github.com/grow4u555-ui/qrcode</textarea>`;
    } else if (optId === 'vcard') {
        area.innerHTML = `
            <input type="text" id="vcard-name" oninput="renderQR()" placeholder="Full Name" value="Surajit" class="w-full glass-input p-2.5 rounded-xl text-xs mb-2">
            <input type="text" id="vcard-phone" oninput="renderQR()" placeholder="Phone" value="+919876543210" class="w-full glass-input p-2.5 rounded-xl text-xs mb-2">
            <input type="email" id="vcard-email" oninput="renderQR()" placeholder="Email" value="surajit@example.com" class="w-full glass-input p-2.5 rounded-xl text-xs">
        `;
    } else if (optId === 'wifi') {
        area.innerHTML = `
            <input type="text" id="wifi-ssid" oninput="renderQR()" placeholder="Wi-Fi SSID" value="MyHomeNetwork" class="w-full glass-input p-2.5 rounded-xl text-xs mb-2">
            <input type="password" id="wifi-pass" oninput="renderQR()" placeholder="Password" value="password123" class="w-full glass-input p-2.5 rounded-xl text-xs">
        `;
    } else {
        area.innerHTML = `<input type="text" id="input-general" oninput="renderQR()" placeholder="Enter details..." value="https://github.com/grow4u555-ui/qrcode" class="w-full glass-input p-3 rounded-xl text-xs">`;
    }

    renderQR();
}

function getPayload() {
    if (activeOption === 'text') {
        return document.getElementById('input-text')?.value || 'https://github.com/grow4u555-ui/qrcode';
    } else if (activeOption === 'vcard') {
        const n = document.getElementById('vcard-name')?.value || '';
        const p = document.getElementById('vcard-phone')?.value || '';
        const e = document.getElementById('vcard-email')?.value || '';
        return `BEGIN:VCARD\nVERSION:3.0\nN:${n}\nTEL:${p}\nEMAIL:${e}\nEND:VCARD`;
    } else if (activeOption === 'wifi') {
        const s = document.getElementById('wifi-ssid')?.value || '';
        const p = document.getElementById('wifi-pass')?.value || '';
        return `WIFI:S:${s};T:WPA;P:${p};;`;
    }
    return document.getElementById('input-general')?.value || 'Surajit QR Code Helper';
}

function renderQR() {
    const target = document.getElementById('qr-code-canvas');
    if (!target) return;
    target.innerHTML = '';

    const fg = document.getElementById('fg-color')?.value || '#000000';
    const bg = document.getElementById('bg-color')?.value || '#ffffff';
    const payload = getPayload();

    qrStyling = new QRCodeStyling({
        width: 200,
        height: 200,
        type: 'canvas',
        data: payload,
        image: uploadedLogoBase64 || '',
        dotsOptions: { color: fg, type: 'rounded' },
        backgroundOptions: { color: bg },
        imageOptions: { crossOrigin: 'anonymous', margin: 4 }
    });

    qrStyling.append(target);
}

function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            uploadedLogoBase64 = evt.target.result;
            renderQR();
        };
        reader.readAsDataURL(file);
    }
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
// Toggle specific dropdown on click
function toggleDropdown(event, dropdownId) {
    event.stopPropagation();
    const dropdown = document.getElementById(dropdownId);
    const isOpen = dropdown.classList.contains('show');
    
    // Close all open dropdowns first
    closeAllDropdowns();

    if (!isOpen) {
        dropdown.classList.add('show');
    }
}

// Close all dropdowns
function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.remove('show');
    });
}

// Close dropdown when clicking anywhere outside
document.addEventListener('click', () => {
    closeAllDropdowns();
});
