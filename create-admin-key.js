// Create Admin Key Script
// Run this in the browser console AFTER the site loads at https://slerpy19.github.io/orbitt-vault/
// This uses the EXACT same device fingerprint algorithm as the app

(function() {
  // Exact replica of the app's generateDeviceId() function
  function generateDeviceId() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx?.fillText('fingerprint', 10, 10);
    const canvasFingerprint = canvas.toDataURL().slice(-20);

    const entropy = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
      canvasFingerprint,
      // NOTE: No crypto.randomUUID() - the app removed this for deterministic IDs
    ].join('|');

    let hash = 0;
    for (let i = 0; i < entropy.length; i++) {
      hash = ((hash << 5) - hash) + entropy.charCodeAt(i);
      hash |= 0;
    }
    return 'dev-' + Math.abs(hash).toString(36);
  }

  const deviceId = generateDeviceId();
  console.log('Your device ID:', deviceId);

  // Create admin key bound to THIS device
  const adminKey = 'orbitt-' + crypto.randomUUID().replace(/-/g, '').slice(0, 24);

  const keys = JSON.parse(localStorage.getItem('orbitt-keys') || '{}');
  // Handle both object and array formats
  const keysArray = Array.isArray(keys) ? keys : Object.values(keys);

  keysArray.push({
    key: adminKey,
    createdAt: Date.now(),
    createdBy: 'admin',
    maxDevices: 1,
    boundDeviceId: deviceId,
    boundAt: Date.now(),
    isActive: true,
    label: 'Admin Key',
  });

  localStorage.setItem('orbitt-keys', JSON.stringify(keysArray));

  console.log('✅ Admin key created:', adminKey);
  console.log('📋 Copy this key and paste it in the login screen');
  console.log('🔑 Admin password for Admin Panel: orbitt-admin-2024');

  // Also store the device ID so the app uses the same one
  localStorage.setItem('orbitt-device-id', deviceId);

  // Reload to apply
  console.log('🔄 Reloading page...');
  setTimeout(() => location.reload(), 500);
})();