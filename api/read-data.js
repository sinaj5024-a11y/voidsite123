// api/read-data.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // Разрешаем только GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Только GET запросы' });
  }

  const fileName = req.query.file;
  
  if (!fileName) {
    return res.status(400).json({ 
      error: 'Укажите файл: ?file=имя.txt' 
    });
  }

  // Защита: только .txt файлы
  if (!fileName.endsWith('.txt')) {
    return res.status(403).json({ 
      error: 'Можно читать только .txt' 
    });
  }

  // Защита от ../ (попытки выйти из папки)
  if (fileName.includes('..') || fileName.includes('/')) {
    return res.status(403).json({ 
      error: 'Недопустимое имя' 
    });
  }

  try {
    // Путь к файлу
    const filePath = path.join(process.cwd(), 'data', fileName);
    
    // Проверяем существование
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ 
        error: 'Файл не найден' 
      });
    }

    // Читаем
    const content = fs.readFileSync(filePath, 'utf-8');
    
    res.status(200).json({ 
      success: true,
      file: fileName,
      content: content 
    });
    
  } catch (error) {
    res.status(500).json({ 
      error: 'Ошибка чтения файла' 
    });
  }
}