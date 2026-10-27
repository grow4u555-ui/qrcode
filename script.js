let qrEngine = null;
let currentType = 'url';

document.addEventListener('DOMContentLoaded', () => {
    selectType('url');
});

function toggleDropdown(id) {
    const target = document.getElementById(id);
    const isOpen = target.classList.contains('show');
    
    closeAllDropdowns();

    if (!isOpen) {
        target.classList.add('show');
    }
}

function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-content').forEach(el => {
        el.classList.remove('show');
    });
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
        closeAllDropdowns();
    }
});

function selectType(type) {
    currentType = type;
    closeAllDropdowns();

    const titleEl = document.getElementById('active-type-title');
    const container = document.getElementById('input-fields-container');
    container.innerHTML = '';

    if (type === 'url') {
        titleEl.innerText = 'Redirect to an existing web URL';
        container.innerHTML = `
            <input type="url" id="val-url" oninput="generateQR()" placeholder="Enter URL" value="https://github.com/grow4u555-ui/qrcode" class="w-full rounded-full bg-white text-black px-4 py-2.5 text-sm outline-none">
        `;
    } else if (type === 'vcard') {
        titleEl.innerText = 'Create Contact Card (vCard)';
        container.innerHTML = `
            <input type="text" id="val-name" oninput="generateQR()" placeholder="Full Name" value="Surajit" class="w-full rounded-xl bg-white text-black p-2.5 text-sm outline-none mb-2">
            <input type="text" id="val-phone" oninput="generateQR()" placeholder="Phone" value="+919876543210" class="w-full rounded-xl bg-white text-black p-2.5 text-sm outline-none">
        `;
    } else if (type === 'wifi') {
        titleEl.innerText = 'Wi-Fi Connection Details';
        container.innerHTML = `
            <input type="text" id="val-ssid" oninput="generateQR()" placeholder="Network SSID" value="HomeWiFi" class="w-full rounded-xl bg-white text-black p-2.5 text-sm outline-none mb-2">
            <input type="password" id="val-pass" oninput="generateQR()" placeholder="Password" value="12345678" class="w-full rounded-xl bg-white text-black p-2.5 text-sm outline-none">
        `;
    } else if (type === 'email') {
        titleEl.innerText = 'Send Email Message';
        container.innerHTML = `
            <input type="email" id="val-email" oninput="generateQR()" placeholder="Email Address" value="surajit@example.com" class="w-full rounded-xl bg-white text-black p-2.5 text-sm outline-none mb-2">
            <input type="text" id="val-sub" oninput="generateQR()" placeholder="Subject" value="Hello" class="w-full rounded-xl bg-white text-black p-2.5 text-sm outline-none">
        `;
    } else {
        titleEl.innerText = 'Plain Text Data';
        container.innerHTML = `
            <textarea id="val-text" oninput="generateQR()" rows="3" placeholder="Enter text..." class="w-full rounded-xl bg-white text-black p-2.5 text-sm outline-none">Surajit QR Code Helper</textarea>
        `;
    }

    generateQR();
}

function getPayload() {
    if (currentType === 'url') return document.getElementById('val-url')?.value || 'https://github.com/grow4u555-ui/qrcode';
    if (currentType === 'vcard') return `BEGIN:VCARD\nN:${document.getElementById('val-name')?.value}\nTEL:${document.getElementById('val-phone')?.value}\nEND:VCARD`;
    if (currentType === 'wifi') return `WIFI:S:${document.getElementById('val-ssid')?.value};T:WPA;P:${document.getElementById('val-pass')?.value};;`;
    if (currentType === 'email') return `mailto:${document.getElementById('val-email')?.value}?subject=${document.getElementById('val-sub')?.value}`;
    return document.getElementById('val-text')?.value || 'Surajit QR Helper';
}

function generateQR() {
    const target = document.getElementById('canvas-target');
    if (!target) return;
    target.innerHTML = '';

    const fg = document.getElementById('qr-color')?.value || '#000000';
    const bg = document.getElementById('bg-color')?.value || '#ffffff';

    qrEngine = new QRCodeStyling({
        width: 180,
        height: 180,
        type: 'canvas',
        data: getPayload(),
        dotsOptions: { color: fg, type: 'rounded' },
        backgroundOptions: { color: bg }
    });

    qrEngine.append(target);
}

function downloadQR(ext) {
    if (qrEngine) qrEngine.download({ name: 'surajit-qr', extension: ext });
}

function openModal() { document.getElementById('scan-modal').classList.remove('hidden'); }
function closeModal() { document.getElementById('scan-modal').classList.add('hidden'); }
