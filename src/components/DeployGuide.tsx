import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Rocket,
  Server,
  Globe,
  Container,
  Cloud,
  Home as HomeIcon,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
  Shield,
  Zap,
  Terminal,
  AlertTriangle,
  CheckCircle2,
  Package,
  Wifi,
  Lock,
  Sparkles,
} from 'lucide-react';

type DeployMethod = 'docker' | 'vps' | 'cloud' | 'local' | 'raspberry';

interface Step {
  title: string;
  description: string;
  command?: string;
  note?: string;
  warning?: string;
}

const deployMethods: Record<DeployMethod, {
  title: string;
  description: string;
  icon: React.ElementType;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  time: string;
  cost: string;
  steps: Step[];
}> = {
  docker: {
    title: 'Docker (Recommended)',
    description: 'Easiest way to deploy. One command and you\'re live.',
    icon: Container,
    difficulty: 'Easy',
    time: '5 min',
    cost: 'Free',
    steps: [
      {
        title: 'Install Docker',
        description: 'Make sure Docker is installed on your machine',
        command: 'curl -fsSL https://get.docker.com | sh',
        note: 'Works on Linux, macOS, and Windows (via WSL2)',
      },
      {
        title: 'Pull the StreamVault Image',
        description: 'Download the latest server image',
        command: 'docker pull streamvault/server:latest',
      },
      {
        title: 'Create Configuration Directory',
        description: 'Set up persistent storage for your library',
        command: 'mkdir -p ~/streamvault/{config,media,downloads}',
      },
      {
        title: 'Run the Server',
        description: 'Start StreamVault with all services',
        command: `docker run -d \\
  --name streamvault \\
  -p 32400:32400 \\
  -p 6881:6881 \\
  -p 6881:6881/udp \\
  -v ~/streamvault/config:/config \\
  -v ~/streamvault/media:/media \\
  -v ~/streamvault/downloads:/downloads \\
  -e PUID=1000 \\
  -e PGID=1000 \\
  -e TZ=America/New_York \\
  --restart unless-stopped \\
  streamvault/server:latest`,
      },
      {
        title: 'Access Your Server',
        description: 'Open your browser and navigate to',
        note: 'http://localhost:32400 — or http://YOUR_IP:32400 for LAN access',
      },
      {
        title: 'Configure Port Forwarding (Optional)',
        description: 'For external access, forward port 32400 on your router',
        warning: 'Only do this if you want access from outside your home network',
      },
    ],
  },
  vps: {
    title: 'VPS / Dedicated Server',
    description: 'Run on a cloud server for 24/7 availability.',
    icon: Server,
    difficulty: 'Medium',
    time: '15 min',
    cost: '$5-20/mo',
    steps: [
      {
        title: 'Rent a VPS',
        description: 'Recommended providers with good bandwidth',
        note: 'Hetzner (€4/mo, 20TB), OVH (€7/mo, unlimited), or DigitalOcean ($12/mo)',
      },
      {
        title: 'Connect via SSH',
        description: 'SSH into your new server',
        command: 'ssh root@YOUR_SERVER_IP',
      },
      {
        title: 'Update System & Install Dependencies',
        description: 'Prepare your server environment',
        command: `apt update && apt upgrade -y
apt install -y docker.io docker-compose nginx certbot`,
      },
      {
        title: 'Clone & Configure StreamVault',
        description: 'Set up the application',
        command: `git clone https://github.com/streamvault/server.git
cd server
cp .env.example .env
nano .env  # Edit your configuration`,
      },
      {
        title: 'Start with Docker Compose',
        description: 'Launch all services together',
        command: 'docker compose up -d',
      },
      {
        title: 'Set Up Nginx Reverse Proxy',
        description: 'Configure HTTPS with Let\'s Encrypt',
        command: `cat > /etc/nginx/sites-available/streamvault << 'EOF'
server {
    listen 80;
    server_name your-domain.com;
    location / {
        proxy_pass http://localhost:32400;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF
ln -s /etc/nginx/sites-available/streamvault /etc/nginx/sites-enabled/
certbot --nginx -d your-domain.com`,
        warning: 'Replace your-domain.com with your actual domain',
      },
      {
        title: 'Configure Firewall',
        description: 'Allow necessary ports',
        command: `ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 6881/tcp
ufw allow 6881/udp
ufw enable`,
      },
    ],
  },
  cloud: {
    title: 'Cloud Platforms',
    description: 'Deploy to managed cloud services.',
    icon: Cloud,
    difficulty: 'Medium',
    time: '10 min',
    cost: 'Free tier available',
    steps: [
      {
        title: 'Option A: Deploy to Vercel (Frontend)',
        description: 'Deploy the web interface for free',
        command: `npm i -g vercel
vercel login
vercel --prod`,
        note: 'Great for the UI, but you still need a backend for torrents',
      },
      {
        title: 'Option B: Deploy Backend to Railway',
        description: 'Host the torrent engine on Railway',
        command: `npm i -g @railway/cli
railway login
railway init
railway up`,
        note: '$5 free credit/month. Persistent volumes available.',
      },
      {
        title: 'Option C: Self-host on Fly.io',
        description: 'Global edge deployment with persistent storage',
        command: `curl -L https://fly.io/install.sh | sh
fly auth login
fly launch
fly volumes create media --size 50
fly deploy`,
      },
      {
        title: 'Option D: Use Oracle Cloud Free Tier',
        description: 'Get a free ARM server with 24GB RAM',
        note: 'Sign up at cloud.oracle.com → Always Free → Create VM.Instance (ARM, 4 OCPUs, 24GB RAM)',
        warning: 'Requires credit card for verification but never charges',
      },
      {
        title: 'Connect Frontend to Backend',
        description: 'Set environment variables to link services',
        command: `# In your frontend .env
VITE_API_URL=https://your-backend.railway.app
VITE_STREAM_URL=https://your-backend.railway.app/stream`,
      },
    ],
  },
  local: {
    title: 'Local Network',
    description: 'Run on your home computer with LAN access.',
    icon: HomeIcon,
    difficulty: 'Easy',
    time: '3 min',
    cost: 'Free',
    steps: [
      {
        title: 'Install Node.js',
        description: 'Download Node.js 18+ from nodejs.org',
        command: `# Or use nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20`,
      },
      {
        title: 'Clone the Repository',
        description: 'Get the StreamVault source code',
        command: `git clone https://github.com/streamvault/server.git
cd streamvault`,
      },
      {
        title: 'Install Dependencies',
        description: 'Install required packages',
        command: 'npm install',
      },
      {
        title: 'Configure Environment',
        description: 'Set up your configuration',
        command: `cp .env.example .env
nano .env`,
      },
      {
        title: 'Start the Server',
        description: 'Launch StreamVault in development or production mode',
        command: `# Development
npm run dev

# Production
npm run build
npm start`,
      },
      {
        title: 'Access from Your Devices',
        description: 'Find your local IP and connect',
        command: `# Find your IP
hostname -I  # Linux
ipconfig getifaddr en0  # macOS
ipconfig  # Windows

# Access at: http://YOUR_IP:5173`,
        note: 'Works on any device on your WiFi: phones, tablets, smart TVs',
      },
      {
        title: 'Optional: Run as Background Service',
        description: 'Keep it running after closing terminal',
        command: `# Using PM2
npm i -g pm2
pm2 start npm --name streamvault -- start
pm2 save
pm2 startup`,
      },
    ],
  },
  raspberry: {
    title: 'Raspberry Pi / NAS',
    description: 'Low-power always-on server at home.',
    icon: Package,
    difficulty: 'Medium',
    time: '20 min',
    cost: '$35-70 (one-time)',
    steps: [
      {
        title: 'Flash Raspberry Pi OS',
        description: 'Use Raspberry Pi Imager to install 64-bit OS',
        note: 'Recommended: Raspberry Pi 4 or 5 with 4GB+ RAM',
      },
      {
        title: 'Enable SSH & Connect',
        description: 'Set up headless access',
        command: `# Create empty ssh file in boot partition
touch /boot/ssh

# Connect
ssh pi@raspberrypi.local`,
      },
      {
        title: 'Install Docker on ARM',
        description: 'Docker works great on Raspberry Pi',
        command: `curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER`,
      },
      {
        title: 'Attach External Storage',
        description: 'Mount a USB drive for media storage',
        command: `sudo mkdir -p /mnt/media
sudo mount /dev/sda1 /mnt/media
# Add to /etc/fstab for auto-mount`,
      },
      {
        title: 'Run StreamVault',
        description: 'Use the ARM-compatible Docker image',
        command: `docker run -d \\
  --name streamvault \\
  -p 32400:32400 \\
  -v /mnt/media:/media \\
  -v ~/streamvault/config:/config \\
  --restart unless-stopped \\
  streamvault/server:arm64`,
      },
      {
        title: 'Set Up Tailscale (Easy Remote Access)',
        description: 'Access your Pi from anywhere without port forwarding',
        command: `curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
# Now access via http://your-pi:32400 from anywhere!`,
        note: 'Tailscale is free for personal use and creates a secure VPN',
      },
    ],
  },
};

export default function DeployGuide() {
  const [selectedMethod, setSelectedMethod] = useState<DeployMethod>('docker');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const method = deployMethods[selectedMethod];

  const copyCommand = (command: string, index: number) => {
    navigator.clipboard.writeText(command);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const toggleStep = (stepKey: string) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepKey)) next.delete(stepKey);
      else next.add(stepKey);
      return next;
    });
  };

  const progress = (completedSteps.size / method.steps.length) * 100;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Publish Your Server</h2>
            <p className="text-gray-400 text-sm">Deploy StreamVault anywhere in minutes</p>
          </div>
        </div>
      </div>

      {/* Method Selector */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {(Object.keys(deployMethods) as DeployMethod[]).map((key) => {
          const m = deployMethods[key];
          const Icon = m.icon;
          const isActive = selectedMethod === key;
          return (
            <motion.button
              key={key}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedMethod(key)}
              className={`relative p-4 rounded-xl border text-left transition-all ${
                isActive
                  ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/10 border-amber-500/50'
                  : 'bg-gray-800/30 border-gray-700/50 hover:border-gray-600'
              }`}
            >
              <Icon className={`w-5 h-5 mb-2 ${isActive ? 'text-amber-400' : 'text-gray-400'}`} />
              <p className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-gray-300'}`}>
                {m.title}
              </p>
              <div className="flex items-center gap-2 mt-2 text-[10px]">
                <span className={`px-1.5 py-0.5 rounded ${
                  m.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' :
                  m.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {m.difficulty}
                </span>
                <span className="text-gray-500">{m.time}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Selected Method Details */}
      <motion.div
        key={selectedMethod}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/30 rounded-2xl border border-gray-700/50 overflow-hidden"
      >
        {/* Method Header */}
        <div className="p-6 border-b border-gray-700/50 bg-gradient-to-r from-amber-500/5 to-transparent">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <method.icon className="w-5 h-5 text-amber-400" />
                {method.title}
              </h3>
              <p className="text-sm text-gray-400 mt-1">{method.description}</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="text-right">
                <p className="text-gray-500">Time</p>
                <p className="text-white font-mono">{method.time}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500">Cost</p>
                <p className="text-emerald-400 font-mono">{method.cost}</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-gray-400">
                {completedSteps.size} of {method.steps.length} steps completed
              </span>
              <span className="text-amber-400 font-mono">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="p-6 space-y-4">
          {method.steps.map((step, index) => {
            const stepKey = `${selectedMethod}-${index}`;
            const isCompleted = completedSteps.has(stepKey);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`relative rounded-xl border p-4 transition-all ${
                  isCompleted
                    ? 'bg-emerald-500/5 border-emerald-500/30'
                    : 'bg-gray-900/30 border-gray-700/50 hover:border-gray-600'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Step Number / Checkbox */}
                  <button
                    onClick={() => toggleStep(stepKey)}
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-amber-500/50'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                  </button>

                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-semibold ${isCompleted ? 'text-emerald-400' : 'text-white'}`}>
                      {step.title}
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">{step.description}</p>

                    {/* Command */}
                    {step.command && (
                      <div className="mt-3 relative group">
                        <div className="flex items-start gap-2 bg-black/50 rounded-lg border border-gray-800 p-3 font-mono text-xs">
                          <Terminal className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <pre className="flex-1 text-gray-300 whitespace-pre-wrap break-all">{step.command}</pre>
                          <button
                            onClick={() => step.command && copyCommand(step.command, index)}
                            className="flex-shrink-0 p-1.5 rounded hover:bg-gray-800 text-gray-500 hover:text-white transition-colors"
                          >
                            {copiedIndex === index ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Note */}
                    {step.note && (
                      <div className="mt-2 flex items-start gap-2 text-xs text-cyan-400 bg-cyan-500/5 border border-cyan-500/20 rounded-lg p-2">
                        <Zap className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        <span>{step.note}</span>
                      </div>
                    )}

                    {/* Warning */}
                    {step.warning && (
                      <div className="mt-2 flex items-start gap-2 text-xs text-amber-400 bg-amber-500/5 border border-amber-500/20 rounded-lg p-2">
                        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        <span>{step.warning}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* After Deploy Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <InfoCard
          icon={Globe}
          title="Remote Access"
          description="Access your server from anywhere using Tailscale, Cloudflare Tunnel, or port forwarding."
          color="cyan"
        />
        <InfoCard
          icon={Shield}
          title="Security"
          description="Enable HTTPS, set strong passwords, and configure firewall rules for safe access."
          color="emerald"
        />
        <InfoCard
          icon={Lock}
          title="Privacy"
          description="Use a VPN, enable anonymous mode, and configure IP filters for maximum privacy."
          color="violet"
        />
      </motion.div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl border border-amber-500/20 p-6"
      >
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Need Help?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            { label: 'Documentation', url: '#' },
            { label: 'Discord Community', url: '#' },
            { label: 'GitHub Issues', url: '#' },
            { label: 'Video Tutorials', url: '#' },
          ].map((link) => (
            <a
              key={link.label}
              href={link.url}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 text-sm text-gray-300 hover:text-white transition-colors group"
            >
              <span>{link.label}</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  description,
  color,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}) {
  const colors: Record<string, string> = {
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 text-cyan-400',
    emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-400',
    violet: 'from-violet-500/20 to-violet-500/5 border-violet-500/20 text-violet-400',
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-4`}
    >
      <Icon className="w-5 h-5 mb-2" />
      <h4 className="text-sm font-semibold text-white mb-1">{title}</h4>
      <p className="text-xs text-gray-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}


