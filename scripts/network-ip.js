const os = require("os");

function getLocalNetworkIPs() {
  const interfaces = os.networkInterfaces();
  const ips = [];

  Object.keys(interfaces).forEach((name) => {
    interfaces[name].forEach((net) => {
      if (net.family === "IPv4" && !net.internal) {
        ips.push(net.address);
      }
    });
  });

  return ips;
}

async function getPublicIP() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    return "Unable to fetch public IP";
  }
}

async function main() {
  const localIPs = getLocalNetworkIPs();
  const publicIP = await getPublicIP();

  console.log("\nAvailable Network URLs:");

  localIPs.forEach((ip) => {
    console.log(`Local/LAN:  http://${ip}:3000`);
  });

  console.log(`Public IP:  ${publicIP}`);
  console.log("");
}

main();
