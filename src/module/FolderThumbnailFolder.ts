import { BaseFolder } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/documents.mjs';
import { FOLDER_THUMBNAIL_MODULE_NAME, getGame } from './settings';

export class FolderThumbnailFolder extends Folder {
  data: any;

  constructor(data = {}) {
    super(
      //@ts-ignore
      mergeObject(
        {
          titleText: 'New Folder',
          colorText: '#000000',
          fontColorText: '#FFFFFF',
          type: 'CompendiumEntry',
          _id: 'ftfolder_' + randomID(10),
          entity: 'FolderThumbnailFolder',
          sorting: 'a',
          parent: null,
          pathToFolder: [],
          folderIcon: null,
          expanded: false,
        },
        data,
      ),
    );
  }

  _getSaveData() {
    const data = Object.assign({}, this.data);
    // delete data.compendiums;
    //@ts-ignore
    delete data.content;
    //@ts-ignore
    delete data.children;
    return data;
  }

  // // Update using data
  // //@s-ignore
  // async update(data=this.data,refresh=true):Promise<any>{
  //     this.data = mergeObject(data,this.data)
  //     // Update game folder
  //     //@ts-ignore
  //     this.collection.get(this.id).data = this.data;
  //     await this.save(refresh);
  // }

  // Save object state to getGame().folders and settings
  async save(refresh = true) {
    //@ts-ignore
    if (!this.collection.get(this.id)) {
      //@ts-ignore
      this.collection.insert(this);
    }
    if (getGame().user?.isGM) {
      const allFolders = <any>getGame().settings.get(FOLDER_THUMBNAIL_MODULE_NAME, 'ftfolders');
      //@ts-ignore
      const currentFolder = allFolders[this.id];
      if (!currentFolder) {
        // create folder
        //@ts-ignore
        allFolders[this.id] = this._getSaveData();
      } else {
        //@ts-ignore
        allFolders[this.id] = mergeObject(currentFolder, this._getSaveData());
      }
      await getGame().settings.set(FOLDER_THUMBNAIL_MODULE_NAME, 'ftfolders', allFolders);
    }
  }

  async moveFolder(destId, updateParent = true) {
    const destFolder = this.collection.get(destId);
    await this._moveToFolder(destFolder, updateParent);
  }

  async moveToRoot() {
    this.path = [];
    this.parent = new BaseFolder();
    await this._updatePath();
    await this.save(false);
  }

  _removeFolder(child) {
    this.children = this.children.filter((c) => c.id != child.id);
  }

  async _moveToFolder(destFolder, updateParent = true) {
    this.path = destFolder ? destFolder.path.concat(destFolder.id) : [];
    if (this.parent && updateParent) {
      this.parent._removeFolder(this);
      await this.parent.save(false);
    }
    if (destFolder) {
      this.parent = destFolder._id;
      this.parent.children = this.parent.children.concat(this);
      await this.parent.save(false);
      this.path = this.parent.path.concat(destFolder._id);
    } else {
      this.parent = new BaseFolder();
      this.path = [];
    }

    await this.save(false);

    await this._updatePath();
    // ui.compendium.refresh();
  }

  // Update path of this and all child folders
  async _updatePath(currentFolder = this, parent = this) {
    if (currentFolder.id != parent.id) {
      currentFolder.path = parent.path.concat(parent.id);
      //@ts-ignore
      await currentFolder.update(currentFolder.data, false);
    }
    if (currentFolder.children) {
      for (const child of currentFolder.children) {
        child._updatePath(child, currentFolder);
      }
    }
  }

  /** @override */
  get children() {
    return this.data.children;
  }

  set children(c) {
    this.data.children = c;
  }

  get name() {
    return this.data.titleText;
  }

  set name(n) {
    this.data.titleText = n;
  }

  get color() {
    return this.data.colorText;
  }

  set color(c) {
    this.data.colorText = c;
  }

  get fontColor() {
    return this.data.fontColorText;
  }

  set fontColor(fc) {
    this.data.fontColorText = fc;
  }

  get icon() {
    return this.data.folderIcon;
  }

  set icon(i) {
    this.folderIcon = i;
  }

  set folderIcon(i) {
    this.data.folderIcon = i;
  }

  get path() {
    return this.data.pathToFolder;
  }

  set path(p) {
    this.data.pathToFolder = p;
  }

  //@ts-ignore
  get parent(): any {
    return this.collection.get(this.data.parent);
  }

  set parent(p: BaseFolder) {
    this.data.parent = p;
  }

  get isDefault() {
    return this.id === 'default';
  }

  get isHidden() {
    return this.id === 'hidden';
  }

  set expanded(e) {
    this.data.expanded = e;
  }

  // Recursively generate a pretty name
  get pathName() {
    if (this.parent) return this.parent.pathName + '/' + this.name;
    return this.name;
  }
}
