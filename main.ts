import { App, Editor, MarkdownView, Plugin, FuzzySuggestModal, TFile } from 'obsidian';

export default class AutoLinkRename extends Plugin {

	async onload() {
		this.addCommand({
			id: 'add-link',
			name: 'Add Link',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				const modal = new FilesModal(this.app, this, editor)
                modal.open()
			}
		});
	}

	onunload() {

	}
	addlink = async (editor: Editor, files: TFile[]) => {
		console.log(files[0])
		const currentFile = files[0]
		const data = this.app.metadataCache.getCache(currentFile["path"])
		var linkName = undefined;
		if (data && data["frontmatter"] && data["frontmatter"]["link-name"]) {
			linkName = data["frontmatter"]["link-name"]
		}
		const currentFileLink = this.app.fileManager.generateMarkdownLink(currentFile, currentFile.path, undefined, linkName)
		editor.replaceSelection(currentFileLink)
	}
}

class FilesModal extends FuzzySuggestModal<TFile> {
    files: TFile[];
    newNoteResult: HTMLDivElement;
    suggestionEmpty: HTMLDivElement;
    obsFile: any;
    noSuggestion: boolean;
    plugin: AutoLinkRename;

    EMPTY_TEXT = 'Files not found';

    constructor(app: App, plugin: AutoLinkRename, public editor: Editor) {
        super(app);
        this.plugin = plugin;
		this.editor = editor;
        this.init();
    }

    init() {
        this.files = this.app.vault.getMarkdownFiles();
        this.emptyStateText = this.EMPTY_TEXT;
        this.setInstructions(
            [
                {command: '↑↓', purpose: 'to navigate'},
                {command: '↵', purpose: 'to append link to the file'},
                {command: 'esc', purpose: 'to dismiss'}
            ]
        );
        this.initNewNoteItem();
    }

    getItems(): TFile[] {
        return this.files;
    }

    getItemText(item: TFile): string {
        this.noSuggestion = false;
        return item.basename;
    }

    onNoSuggestion() {
        this.noSuggestion = true;
    }

    onChooseItem(item: TFile, evt: MouseEvent | KeyboardEvent): void {
        if (this.noSuggestion) {
            // this.modalNoteCreation.create(this.inputEl.value);
        } else {
            this.plugin.addlink(this.editor, [item]);
        }
    }

    initNewNoteItem() {
        this.newNoteResult = document.createElement('div');
        this.newNoteResult.addClasses(['suggestion-item', 'is-selected']);
        this.suggestionEmpty = document.createElement('div');
        this.suggestionEmpty.addClass('suggestion-empty');
        this.suggestionEmpty.innerText = this.EMPTY_TEXT;
    }

    itemInstructionMessage(resultEl: HTMLElement, message: string) {
        const el = document.createElement('kbd');
        el.addClass('suggestion-hotkey');
        el.innerText = message;
        resultEl.appendChild(el);
    }

}
