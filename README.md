# SmartKeep - Google Keep Clone

A React + Node.js note-taking application with SQLite database backend, replicating the functionality of Google Keep.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation & Setup

1. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Start the Backend Server**
   ```bash
   cd server
   npm start
   ```
   Server runs on: `http://localhost:4001`

4. **Start the Frontend Development Server**
   ```bash
   cd client
   npm run dev
   ```
   Client runs on: `http://localhost:5173`

## 📁 Project Structure

```
SmartKeep/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── Header.jsx      # App header with theme toggle
│   │   │   ├── SearchBar.jsx   # Search and filter functionality
│   │   │   ├── NoteCard.jsx    # Individual note display
│   │   │   └── NoteModal.jsx   # Note creation/editing modal
│   │   ├── services/
│   │   │   └── api.js          # API service layer
│   │   ├── App.jsx             # Main application component
│   │   ├── App.css             # Application styling
│   │   └── main.jsx            # React entry point
│   └── package.json
├── server/                     # Node.js backend
│   ├── database/
│   │   ├── init.js             # Database initialization
│   │   └── smartkeep.db        # SQLite database file
│   ├── routes/
│   │   └── notes.js            # Notes API routes
│   ├── index.js                # Express server
│   ├── .env                    # Environment variables
│   └── package.json
└── package.json                # Root package.json
```

## ✨ Features

### Core Functionality
- ✅ Create, edit, delete notes
- ✅ Search notes by title and content
- ✅ Filter by categories
- ✅ Pin/unpin important notes
- ✅ Archive/unarchive notes
- ✅ Dark/light theme toggle

### Advanced Features
- ✅ Password-sensitive content masking
- ✅ Copy notes to clipboard
- ✅ Category management with color coding
- ✅ Export/import notes as JSON
- ✅ Auto-save functionality
- ✅ Responsive design

### Security Features
- ✅ Rate limiting
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Input validation
- ✅ SQL injection protection

## 🛠 API Endpoints

### Notes Management
- `GET /api/notes` - Get all notes (with filters)
- `POST /api/notes` - Create a new note
- `GET /api/notes/:id` - Get specific note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `PATCH /api/notes/:id/pin` - Toggle pin status
- `PATCH /api/notes/:id/archive` - Toggle archive status

### Utility Endpoints
- `GET /api/notes/categories` - Get all categories
- `GET /api/notes/export` - Export all notes
- `POST /api/notes/import` - Import notes
- `GET /api/health` - Health check

## 🎨 Design Features

### Theme Support
- Light and dark theme toggle
- CSS custom properties for theming
- Persistent theme preference

### Responsive Layout
- Mobile-first design
- Responsive grid layout
- Touch-friendly interface

### Visual Elements
- Color-coded categories
- Lucide React icons
- Smooth animations
- Material Design inspired

## 🔧 Configuration

### Environment Variables (.env)
```env
NODE_ENV=development
PORT=4001
CLIENT_URL=http://localhost:3000
DATABASE_PATH=./database/smartkeep.db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### Database Schema
```sql
CREATE TABLE notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'Work',
  pinned INTEGER DEFAULT 0,
  is_password INTEGER DEFAULT 0,
  archived INTEGER DEFAULT 0,
  CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  LastModifiedDate DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🧪 Testing

### Manual Testing
1. Open `http://localhost:5173` in your browser
2. Test creating, editing, and deleting notes
3. Test search and filter functionality
4. Test pin/archive features
5. Test theme toggle
6. Test export/import functionality

### API Testing
Health check: `http://localhost:4001/api/health`

## 📝 Usage Tips

### Keyboard Shortcuts
- `Ctrl+Enter` - Save note in modal
- `Escape` - Close modal

### Special Features
- Type "password:" in note content to mark as sensitive
- Use the copy button to copy notes to clipboard
- Pin important notes to keep them at the top
- Archive completed notes to declutter your view

## 🛠 Development

### Adding New Features
1. Backend: Add routes in `server/routes/notes.js`
2. Frontend: Create components in `client/src/components/`
3. API: Update `client/src/services/api.js`

### Database Changes
1. Update schema in `server/database/init.js`
2. Handle migrations carefully for existing data

## 🚧 Known Issues

- None currently identified

## 📋 Todo / Future Enhancements

- [ ] Add user authentication
- [ ] Implement note sharing
- [ ] Add rich text editing
- [ ] Implement note tags
- [ ] Add note templates
- [ ] Implement note version history
- [ ] Add collaborative editing
- [ ] Implement offline support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with React + Node.js + SQLite** 🚀
