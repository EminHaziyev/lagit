<img src="http://raw.githubusercontent.com/EminHaziyev/lagit/refs/heads/main/public/logo.png" width="100px">
# Lagit

> Peer-to-peer version control over LAN. No internet. No setup. Just code.

---

## 🧠 What is Lagit?

**Lagit** is a **local-first, Git-inspired version control system** that lets users on the same network share code repositories — all **without internet or external Git servers**. Just run the Lagit app on one computer, and everyone in the same Wi-Fi network can:

- 📦 Create and share repositories
- 📥 Pull updates from others
- 📤 Push changes to your own repos
- 🌐 Use both CLI and web GUI to interact with the system

Perfect for hackathons, offline workshops, classrooms, or remote field teams.

---

## 📸 Example Scenario

1. **Emin** starts a Lagit server on his laptop.
2. **Rza** and **Natiq** connect to the same Wi-Fi.
3. **Rza** creates a repo called `design-system` and pushes his code.
4. **Emin** pulls `design-system` to his machine.
5. Later, **Natiq** also clones it and contributes by pushing back.

No cloud, no centralized GitHub/GitLab — everything is local and direct.

---

## 🔧 Features

- ✅ Works completely offline (LAN-only)
- ✅ Web GUI for non-technical users
- ✅ CLI tool for developers (`lagit`)
- ✅ Each user can create their own repositories
- ✅ Share projects by pushing and pulling files
- ✅ Smart file diffing to avoid overwrites
- ✅ Automatic device discovery (mDNS or local scan)
- ✅ Stores metadata on host machine only

---


## 🏗️ Architecture
- One user runs the Lagit Host (Node.js/Express backend).
- Others connect through Web UI or CLI tool.
- File exchanges happen peer-to-peer over HTTP via LAN.
- Repository metadata (like commits and users) is stored in JSON files on the host.


## 🛠 Tech Stack
| Layer           | Tech                                          |
| --------------- | --------------------------------------------- |
| Backend         | Node.js, Express                              |
| Frontend        | Vanilla HTML/CSS + JS                         |
| CLI Tool        | Node.js                                       |
| Core Repo Logic | Node.js, Commander.js                         |
| File Handling   | multer                                        |



## 🚀 Get Started
To use lagit CLI, install it like this:
```
git clone https://github.com/EminHaziyev/lagit.git
cd lagit
cd lagit-cli
npm install -g .
```

## Usage
Options
| Option       | Description                  |
| ------------ | ---------------------------- |
| `-h, --help` | Display help for the command |


Commands
| Command                            | Description                                         |
| ---------------------------------- | --------------------------------------------------- |
| `init-login <username> <password>` | Initialize a `lagit` repo and login to your account |
| `create <repoName>`                | Create a new repository on the `lagit` server       |
| `commit <message>`                 | Add a commit message to your repository             |
| `push`                             | Push your code to the `lagit` server                |
| `clone <repoName>`                 | Clone a repository from the `lagit` server          |
| `pull`                             | Pull the latest changes from the `lagit` server     |
| `delete <repoName>`                | Delete one of your repositories from the server     |
| `list-repos`                       | List all repositories on the `lagit` server         |
| `help [command]`                   | Display help for a specific command                 |

## Next Steps
Add real version controlling system with changes, stages and etc.

## 💡 Use Cases
| Audience        | Use Case                           |
| --------------- | ---------------------------------- |
| 🧑‍🏫 Schools   | Share code between students easily |
| 🧪 Hackathons   | No setup, just connect and push    |
| 🏞️ Field teams | Code collaboration in remote areas |
| 🧪 Workshops    | Give starter code to all in LAN    |
| 🧙 Hobbyists    | Local GitHub alternative           |

## 🤔 Why Not Just Use Git?
Because Lagit is:

- Internet-free: No GitHub, no config
- Zero-setup: No SSH keys, no remotes
- Beginner-friendly: Anyone can drag-n-drop files
- Decentralized-friendly: Everyone owns their code

## 🪪 License
MIT — use it, fork it, improve it.

## 👨‍💻 Created by
Emin Haziyev
> Inspired by simplicity. Powered by code.
