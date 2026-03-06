import React, { useState, useEffect } from 'react';
import { fetchNotes, createNote, updateNote, deleteNote } from './api';
import { Plus, Trash2, Edit3, Sun, Moon, Sparkles, FileText } from 'lucide-react';

function App() {
    const [notes, setNotes] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [currentNote, setCurrentNote] = useState({ title: '', content: '' });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        // Apply dark mode class to root
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    useEffect(() => {
        loadNotes();
    }, []);

    const loadNotes = async () => {
        try {
            const data = await fetchNotes();
            setNotes(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveNote = async () => {
        try {
            if (isEditing) {
                await updateNote(currentNote.id, currentNote);
            } else {
                await createNote(currentNote);
            }
            setIsEditorOpen(false);
            setCurrentNote({ title: '', content: '' });
            setIsEditing(false);
            loadNotes();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditNote = (note) => {
        setCurrentNote(note);
        setIsEditing(true);
        setIsEditorOpen(true);
    };

    const handleDeleteNote = async (id) => {
        try {
            await deleteNote(id);
            loadNotes();
        } catch (err) {
            console.error(err);
        }
    };

    const openNewNoteLayout = () => {
        setCurrentNote({ title: '', content: '' });
        setIsEditing(false);
        setIsEditorOpen(true);
    };

    return (
        <div className="min-h-screen bg-grid-pattern relative overflow-hidden transition-colors duration-500">

            {/* Decorative Neon Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-cyan/20 blur-[120px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neon-magenta/20 blur-[120px] rounded-full pointer-events-none translate-x-1/4 translate-y-1/4"></div>

            {/* Main Layout */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 flex flex-col h-screen">

                {/* Header */}
                <header className="flex items-center justify-between mb-12 glass rounded-2xl p-4 shadow-lg dark:shadow-neon-cyan/10 transition-shadow">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-br from-neon-cyan to-neon-magenta rounded-xl shadow-lg">
                            <Sparkles className="text-white w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                            Nexus Notes
                        </h1>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="p-3 rounded-full hover:bg-gray-200 dark:hover:bg-dark-border transition-colors group"
                        >
                            {isDarkMode ?
                                <Sun className="w-5 h-5 text-gray-400 group-hover:text-neon-lime transition-colors" /> :
                                <Moon className="w-5 h-5 text-gray-600 group-hover:text-neon-magenta transition-colors" />
                            }
                        </button>
                        <button
                            onClick={openNewNoteLayout}
                            className="flex items-center space-x-2 bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-xl font-medium hover:scale-105 active:scale-95 transition-all dark:hover:bg-neon-cyan dark:hover:text-black dark:hover:shadow-[0_0_20px_rgba(0,255,255,0.4)]"
                        >
                            <Plus className="w-5 h-5" />
                            <span>New Note</span>
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-visible overflow-x-visible pb-8 custom-scrollbar px-2">
                    {notes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[50vh] opacity-60">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-neon-cyan/30 blur-xl rounded-full animate-pulse"></div>
                                <FileText className="w-20 h-20 text-black dark:text-white relative z-10" />
                            </div>
                            <p className="text-2xl font-semibold tracking-wide">Your creative space is empty</p>
                            <p className="text-base mt-3 opacity-60">Click 'New Note' to start exploring your ideas.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-8 pt-4 px-4 -mx-4 -mt-4">
                            {notes.map(note => (
                                <div
                                    key={note.id}
                                    className="group relative bg-white/40 dark:bg-[#111111]/80 backdrop-blur-xl p-8 rounded-3xl border border-white/20 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-2 hover:scale-[1.03] transition-all duration-500 hover:border-neon-cyan/50 dark:hover:border-neon-cyan hover:shadow-[0_8px_40px_rgba(0,255,255,0.15)] cursor-pointer flex flex-col min-h-[260px] overflow-hidden hover:z-50 z-10"
                                    onClick={() => handleEditNote(note)}
                                >
                                    {/* Card Glow Effect */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/0 rounded-full blur-3xl group-hover:bg-neon-cyan/20 transition-colors duration-500 pointer-events-none -mr-16 -mt-16"></div>

                                    <h3 className="text-xl font-bold mb-4 pr-10 line-clamp-2 text-gray-900 dark:text-gray-100 leading-snug group-hover:text-neon-cyan transition-colors duration-300">{note.title}</h3>
                                    <p className="text-[15px] leading-relaxed opacity-75 dark:opacity-70 whitespace-pre-wrap line-clamp-5 flex-1 font-light">{note.content}</p>

                                    {/* Decorative Footer Line */}
                                    <div className="mt-6 w-12 h-1 bg-gradient-to-r from-neon-cyan to-transparent rounded-full opacity-50 group-hover:w-full transition-all duration-700 ease-in-out"></div>

                                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }}
                                            className="p-2.5 rounded-xl bg-white/80 dark:bg-black/80 shadow-lg text-red-500 hover:bg-red-500 hover:text-white dark:hover:neon-glow-magenta transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Editor Modal */}
            {isEditorOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div
                        className="w-full max-w-2xl bg-white dark:bg-dark-surface rounded-3xl p-8 shadow-2xl dark:shadow-[0_0_50px_rgba(0,255,255,0.1)] border border-light-border dark:border-dark-border transform transition-all animate-in zoom-in-95 duration-200"
                    >
                        <input
                            type="text"
                            placeholder="Note Title"
                            value={currentNote.title}
                            onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
                            className="w-full text-3xl font-bold bg-transparent border-none outline-none mb-6 text-black dark:text-white placeholder:opacity-30"
                        />
                        <textarea
                            placeholder="What's on your mind?"
                            value={currentNote.content}
                            onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
                            className="w-full h-64 bg-transparent border-none outline-none resize-none text-lg text-black dark:text-white placeholder:opacity-30 custom-scrollbar"
                        />

                        <div className="flex justify-end space-x-4 mt-8 pt-4 border-t border-light-border dark:border-dark-border">
                            <button
                                onClick={() => setIsEditorOpen(false)}
                                className="px-6 py-2.5 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-dark-border transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveNote}
                                disabled={!currentNote.title || !currentNote.content}
                                className="px-6 py-2.5 rounded-xl font-medium bg-black dark:bg-neon-cyan text-white dark:text-black hover:opacity-90 disabled:opacity-50 transition-all dark:hover:shadow-[0_0_15px_rgba(0,255,255,0.5)]"
                            >
                                {isEditing ? 'Save Changes' : 'Create Note'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
