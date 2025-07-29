import React, { useState } from 'react';
import { Note, NoteFolder, DEFAULT_FOLDERS } from '../../types/note';
import { INITIAL_NOTES, NOTE_TEMPLATES, processTemplate } from '../../data/templates';
import './NoteSystem.css';

export interface NoteSystemProps {}

export const NoteSystem: React.FC<NoteSystemProps> = () => {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [selectedFolder, setSelectedFolder] = useState<string>('inbox');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [folders] = useState<NoteFolder[]>(DEFAULT_FOLDERS);
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);

  // 过滤当前文件夹的笔记
  const currentFolderNotes = notes.filter(note =>
    note.folder === selectedFolder &&
    (searchQuery === '' ||
     note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
     note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  const currentFolder = folders.find(f => f.id === selectedFolder);

    // 创建新笔记
  const createNewNote = (): void => {
    setShowTemplateMenu(true);
  };

  // 使用模板创建笔记
  const createNoteFromTemplate = (templateKey?: string): void => {
    const now = new Date();
    let title = '新笔记';
    let content = '';

    if (templateKey && NOTE_TEMPLATES[templateKey as keyof typeof NOTE_TEMPLATES]) {
      const template = NOTE_TEMPLATES[templateKey as keyof typeof NOTE_TEMPLATES];

      // 根据文件夹类型设置默认标题
      switch (selectedFolder) {
        case 'daily':
          title = `${now.toISOString().split('T')[0]} 日记`;
          break;
        case 'projects':
          title = '新项目';
          break;
        case 'zettelkasten':
          title = '新概念';
          break;
        default:
          title = '新笔记';
      }

      content = processTemplate(template, { title });
    }

    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      folder: selectedFolder,
      tags: [],
      createdAt: now,
      updatedAt: now,
      filePath: `${currentFolder?.path}/${Date.now()}-${title}.md`
    };

    setNotes(prev => [...prev, newNote]);
    setSelectedNote(newNote);
    setIsEditing(true);
    setShowTemplateMenu(false);
  };

  // 获取当前文件夹的推荐模板
  const getRecommendedTemplate = (): string | undefined => {
    const templateMap: Record<string, string> = {
      daily: 'daily',
      projects: 'project',
      zettelkasten: 'zettelkasten',
      resources: 'resource'
    };
    return templateMap[selectedFolder];
  };

  // 保存笔记
  const saveNote = (updatedNote: Note): void => {
    setNotes(prev => prev.map(note =>
      note.id === updatedNote.id ? { ...updatedNote, updatedAt: new Date() } : note
    ));
    setSelectedNote(updatedNote);
    setIsEditing(false);
  };

  // 删除笔记
  const deleteNote = (noteId: string): void => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
      setIsEditing(false);
    }
  };

  // 选择笔记
  const selectNote = (note: Note): void => {
    setSelectedNote(note);
    setIsEditing(false);
  };

  return (
    <div className="note-system">
      <div className="note-system-header">
        <h1>📝 知识管理系统</h1>
        <div className="search-bar">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索笔记..."
            className="search-input"
          />
        </div>
      </div>

      <div className="note-system-content">
        {/* 文件夹侧边栏 */}
        <div className="folder-sidebar">
          <h3>文件夹</h3>
          {folders.map(folder => (
            <div
              key={folder.id}
              className={`folder-item ${selectedFolder === folder.id ? 'active' : ''}`}
              onClick={() => setSelectedFolder(folder.id)}
            >
              <span className="folder-icon">{folder.icon}</span>
              <span className="folder-name">{folder.name}</span>
              <span className="note-count">
                {notes.filter(note => note.folder === folder.id).length}
              </span>
            </div>
          ))}
        </div>

        <div className="note-content-area">
          {/* 笔记列表 */}
          <div className="note-list">
            <div className="note-list-header">
              <h3>{currentFolder?.icon} {currentFolder?.name}</h3>
              <div className="note-actions">
                <button onClick={createNewNote} className="new-note-btn">
                  + 新笔记
                </button>
                {showTemplateMenu && (
                  <div className="template-menu">
                    <div className="template-menu-header">
                      <span>选择模板</span>
                      <button
                        onClick={() => setShowTemplateMenu(false)}
                        className="close-menu-btn"
                      >
                        ×
                      </button>
                    </div>
                    <div className="template-options">
                      <button
                        onClick={() => createNoteFromTemplate()}
                        className="template-option"
                      >
                        📝 空白笔记
                      </button>
                      {getRecommendedTemplate() && (
                        <button
                          onClick={() => createNoteFromTemplate(getRecommendedTemplate())}
                          className="template-option recommended"
                        >
                          ⭐ 推荐模板
                        </button>
                      )}
                      <button
                        onClick={() => createNoteFromTemplate('daily')}
                        className="template-option"
                      >
                        📅 日记模板
                      </button>
                      <button
                        onClick={() => createNoteFromTemplate('project')}
                        className="template-option"
                      >
                        🚀 项目模板
                      </button>
                      <button
                        onClick={() => createNoteFromTemplate('zettelkasten')}
                        className="template-option"
                      >
                        🗃️ 卡片模板
                      </button>
                      <button
                        onClick={() => createNoteFromTemplate('meeting')}
                        className="template-option"
                      >
                        👥 会议模板
                      </button>
                      <button
                        onClick={() => createNoteFromTemplate('resource')}
                        className="template-option"
                      >
                        📖 资源模板
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="note-list-content">
              {currentFolderNotes.map(note => (
                <div
                  key={note.id}
                  className={`note-item ${selectedNote?.id === note.id ? 'active' : ''}`}
                  onClick={() => selectNote(note)}
                >
                  <h4>{note.title}</h4>
                  <p>{note.content.substring(0, 100)}...</p>
                  <div className="note-meta">
                    <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(note.id);
                      }}
                      className="delete-btn"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 笔记编辑器 */}
          <div className="note-editor-container">
            {selectedNote ? (
              <div className="note-editor">
                <div className="note-editor-header">
                  <input
                    type="text"
                    value={selectedNote.title}
                    onChange={(e) => {
                      const updatedNote = { ...selectedNote, title: e.target.value };
                      setSelectedNote(updatedNote);
                      if (isEditing) {
                        saveNote(updatedNote);
                      }
                    }}
                    disabled={!isEditing}
                    className="note-title-input"
                  />
                  <div className="editor-actions">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => {
                            saveNote(selectedNote);
                            setIsEditing(false);
                          }}
                          className="save-btn"
                        >
                          保存
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="cancel-btn"
                        >
                          取消
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="edit-btn"
                      >
                        编辑
                      </button>
                    )}
                  </div>
                </div>
                <textarea
                  value={selectedNote.content}
                  onChange={(e) => {
                    const updatedNote = { ...selectedNote, content: e.target.value };
                    setSelectedNote(updatedNote);
                    if (isEditing) {
                      saveNote(updatedNote);
                    }
                  }}
                  disabled={!isEditing}
                  className="note-content-textarea"
                  placeholder="开始写笔记..."
                />
              </div>
            ) : (
              <div className="no-note-selected">
                <div className="empty-state">
                  <div className="empty-state-icon">📝</div>
                  <h3>选择一个笔记开始</h3>
                  <p>从左侧选择一个笔记进行查看或编辑</p>
                  <button onClick={createNewNote} className="create-note-btn">
                    创建新笔记
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
