import { App, Editor, MarkdownView, Plugin, FuzzySuggestModal, TFile } from 'obsidian';


export default class dateFixer extends Plugin {

	async onload() {
		this.addCommand({
			id: 'add-dates',
			name: 'Add Dates',
			editorCallback: (editor: Editor, view: MarkdownView) => {
                console.log("editor title?")
                console.log(view.file?.basename)
                if (view.file) {
                    const filename = view.file.basename
                    const date = new Date(filename)
                    const yesterday = this.addDays(date, -1)
                    const tomorrow = this.addDays(date, 1)
                    const yesterdayString = yesterday.toISOString().split("T")[0]
                    const tomorrowString = tomorrow.toISOString().split("T")[0]
                    editor.replaceSelection(`[[${yesterdayString}|Gestern]] [[${tomorrowString}|Morgen]]`)
                }
                
                
			}
		});
	}
 
	onunload() {

	}
    addDays(date: Date, days: number): Date {
        let result = new Date(date);
        result.setDate(date.getDate() + days);
        return result;
    }
}

