import { writeTextFile, readTextFile, BaseDirectory } from '@tauri-apps/api/fs';

export async function writeFile_Text(filepath: string, contents: string) {
    filepath = 'todolist.json'
    await writeTextFile(filepath, contents, { dir: BaseDirectory.App })
    .then(() => {
        console.log('Complete!');
    })
    .catch((err) => {
        console.log(err)
    });
}

export async function readFile_Text(filepath: string) {
    let contents = await readTextFile(filepath, { dir: BaseDirectory.App })
    .then((_contents) => {
        return _contents;
    })
    .catch((err) => {
        console.log(err);
        writeTextFile(filepath, '', { dir: BaseDirectory.App })
        .then(() => {})
        .catch((err) => console.log(err))
        
        return 'Error';
    });

    return contents;
}