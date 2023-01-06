import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile } from 'obsidian';
import { getLastestIoCs, ThreatFox } from 'src/threatfox_api';
import { MarkdownAdder } from 'src/utils';
import { CardMenu, CARD_MENU_LEAF } from 'src/card_menu';

// Remember to rename these classes and interfaces!

interface ThreatFoxPluginInterface {
	ticketPath: string;
	completePath: string;
	amountOfIoCs: string;
}

const DEFAULT_SETTINGS: Partial<ThreatFoxPluginInterface> = {
	ticketPath: '',
	completePath: '',
	amountOfIoCs: '5'
}

export default class ThreatFoxPlugin extends Plugin {
	settings: ThreatFoxPluginInterface;

	async onload() {
		await this.loadSettings();
		
		this.registerView(
			CARD_MENU_LEAF,
			(leaf) => new CardMenu(leaf)
		);

		this.addRibbonIcon("dice", "Open ThreatFox IoC List", () => {
			this.activateView();
		});

		this.addCommand({
			id: "Query ThreatFox",
			name: 'Get the most recent ThreatFox IoCs and create analysis documents.',
			callback: async () => {
				const threatFoxObjects: Array<ThreatFox> = await getLastestIoCs();
				const files: TFile[] = this.app.vault.getMarkdownFiles();
				const regex = /\d+_\S+.md/gm;

				var count = 0;

				threatFoxObjects.forEach((item) => {
					if (count >= Number(this.settings.amountOfIoCs))
						return;
					
					if (this.app.vault.getAbstractFileByPath(`${this.settings.ticketPath}/${item.id}_${item.malware}.md`) == null && this.app.vault.getAbstractFileByPath(`${this.settings.completePath}/${item.id}_${item.malware}.md`) == null){
						const ma = new MarkdownAdder();
						
						ma.addContent(`tags:: #threathunting`);
						ma.addContent(`verdict::`);
						ma.addContent(`ticket::`);
						ma.addContent(`date::`);
						ma.addContent(`status::`);

						ma.addSplit();

						ma.addHeader1('IoC Information');
						ma.addContent(item.toString());

						ma.addSplit();

						ma.addHeader1('Analysis');
						
						ma.addSplit();

						ma.addHeader1('Verdict')

						ma.addSplit()

						console.log(`creating: ${this.settings.ticketPath}/${item.id}_${item.malware}.md`);
						this.app.vault.create(`${this.settings.ticketPath}/${item.id}_${item.malware}.md`, ma.toString());
						count += 1;
					}
				});
			}
		});

		this.addCommand({
			id: "IoC Cards",
			name: "Display latest IoC cards",
			callback: async () => {
				this.activateView()
			}
		});
		this.addSettingTab(new ThreatFoxSettingTab(this.app, this));
		console.log("Load finished...");
	}

	async activateView() {
		this.app.workspace.detachLeavesOfType(CARD_MENU_LEAF);

		await this.app.workspace.getRightLeaf(false).setViewState({
			type: CARD_MENU_LEAF,
			active: true,
		});

		this.app.workspace.revealLeaf(
			this.app.workspace.getLeavesOfType(CARD_MENU_LEAF)[0]
		);
	}

	async onunload() {
		this.app.workspace.detachLeavesOfType(CARD_MENU_LEAF);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
	}

	async saveSettings() {
		console.log(this.settings);
		await this.saveData(this.settings);
	}
}

class ThreatFoxSettingTab extends PluginSettingTab {
	plugin: ThreatFoxPlugin;

	constructor(app: App, plugin: ThreatFoxPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'ThreatFox Settings'})

		new Setting(containerEl)
			.setName('Report Path')
			.setDesc('Location where to save the reports')
			.addText(text => text
				.setPlaceholder('<enter_vault_folder_path_here>')
				.setValue(this.plugin.settings.ticketPath)
				.onChange(async (value) => {
					this.plugin.settings.ticketPath = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Completed Items Path')
			.setDesc('Location where reviewed IoCs are stored.')
			.addText(text => text
				.setPlaceholder('<ioc_folder/completed>')
				.setValue(this.plugin.settings.completePath)
				.onChange(async (value) => {
					this.plugin.settings.completePath = value;
					await this.plugin.saveSettings;
				}));
		
		new Setting(containerEl)
			.setName('Amount of IoCs to Return')
			.setDesc('Specify the amount of IoCs you wish to be created.')
			.addText(text => text
				.setPlaceholder('<number_of_iocs>')
				.setValue(this.plugin.settings.amountOfIoCs)
				.onChange(async (value) => {
					this.plugin.settings.completePath = value;
					await this.plugin.saveSettings;
				}));

	}
}
