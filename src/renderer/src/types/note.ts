// 笔记系统类型定义

export interface NoteFolder {
  id: string;
  name: string;
  path: string;
  description: string;
  color?: string;
  icon?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  folder: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  filePath: string;
}

export interface NoteSystemConfig {
  folders: NoteFolder[];
  defaultFolder: string;
  templateFolder: string;
}

// 预定义的文件夹结构
export const DEFAULT_FOLDERS: NoteFolder[] = [
  {
    id: 'inbox',
    name: '00-Inbox',
    path: '00-Inbox',
    description: '收件箱 - 用于临时存放新的想法和未整理的内容',
    color: '#ff6b6b',
    icon: '📥'
  },
  {
    id: 'daily',
    name: '01-Daily',
    path: '01-Daily',
    description: '每日笔记 - 记录日常想法、会议记录等',
    color: '#4ecdc4',
    icon: '📅'
  },
  {
    id: 'zettelkasten',
    name: '02-Zettelkasten',
    path: '02-Zettelkasten',
    description: '卡片盒笔记 - 知识原子化，构建知识网络',
    color: '#45b7d1',
    icon: '🗃️'
  },
  {
    id: 'projects',
    name: '03-Projects',
    path: '03-Projects',
    description: '项目笔记 - 具有截止日期和明确目标的工作',
    color: '#96ceb4',
    icon: '🚀'
  },
  {
    id: 'topics',
    name: '04-Topics',
    path: '04-Topics',
    description: '主题笔记 - 持续关注和学习的主题',
    color: '#feca57',
    icon: '📚'
  },
  {
    id: 'areas',
    name: '05-Areas',
    path: '05-Areas',
    description: '生活领域 - 需要持续维护的生活标准',
    color: '#ff9ff3',
    icon: '🏠'
  },
  {
    id: 'resources',
    name: '06-Resources',
    path: '06-Resources',
    description: '资源库 - 参考资料、工具、链接等',
    color: '#54a0ff',
    icon: '📖'
  },
  {
    id: 'archives',
    name: '07-Archives',
    path: '07-Archives',
    description: '归档 - 已完成或不再活跃的内容',
    color: '#a4b0be',
    icon: '📦'
  },
  {
    id: 'templates',
    name: '99-Templates',
    path: '99-Templates',
    description: '模板 - 用于快速创建标准化笔记的模板',
    color: '#c44569',
    icon: '📋'
  }
];

export interface SearchResult {
  note: Note;
  matchType: 'title' | 'content' | 'tag';
  snippet?: string;
}
