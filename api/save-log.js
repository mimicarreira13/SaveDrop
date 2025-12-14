import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const newLog = req.body;

            // Caminho absoluto para o arquivo JSON
            const filePath = path.join(process.cwd(), 'data', 'activityLog.json');

            // Ler o arquivo atual
            const fileData = await fs.promises.readFile(filePath, 'utf8');
            const logs = JSON.parse(fileData);

            // Adicionar o novo log no início do array
            logs.unshift(newLog);

            // Escrever de volta no arquivo
            await fs.promises.writeFile(filePath, JSON.stringify(logs, null, 2));

            res.status(200).json({ success: true, message: 'Log adicionado com sucesso' });
        } catch (error) {
            console.error('Erro ao salvar log:', error);
            res.status(500).json({ success: false, error: 'Erro ao salvar log' });
        }
    } else if (req.method === 'GET') {
        // Retornar logs
        const filePath = path.join(process.cwd(), 'data', 'activityLog.json');
        const fileData = await fs.promises.readFile(filePath, 'utf8');
        const logs = JSON.parse(fileData);
        res.status(200).json(logs);
    } else {
        res.status(405).json({ success: false, error: 'Método não permitido' });
    }
}