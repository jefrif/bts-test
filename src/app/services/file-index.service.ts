/* eslint-disable @typescript-eslint/naming-convention */
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileIndexService {

  constructor() {
  }
/* 
  // @ts-ignore
  buildTree(nodes: any) {
    const tree: any = {};
    const map: any = {};

    for (const node of nodes) {
      const {_id, parentId} = node;
      node.children = [];

      if (!map[_id]) {
        map[_id] = node;
      } else {
        map[_id] = {...map[_id], ...node};
      }

      if (parentId === null) {
        tree[_id] = map[_id];
      } else {
        const parent = map[parentId];   // TODO: handle if parent == null
        map[_id].parent = parent;
        parent.children.push(map[_id]);
      }
    }

    return Object.values(tree);
  }
 */
  buildTree(pnodes: any) {
    const tree: any[] = [];
    const map: any[] = [];
  
    // Create a map to efficiently look up nodes by their id
    pnodes.forEach((node: any) => {
      map[node._id] = { ...node, children: [] };
    });
  
    // Iterate over the nodes to build the tree
    pnodes.forEach((node: any) => {
      if (node.parentId !== null) {
        // If the node has a parent, add it as a child to the parent
        map[node.parentId].children.push(map[node._id]);
      } else {
        // If the node doesn't have a parent, add it to the root of the tree
        tree.push(map[node._id]);
      }
    });
  
    return tree;
  }
  
  createFileIndexBody(): any {
    return {
      mappings: {
        properties: {
          name: {
            type: 'text',
            meta: {
              resultTitle: 'yes'
            },
            fields: {
              keyword: {
                type: 'keyword',
                ignore_above: 256,
                store: true
              }
            }
          },
          createTime: {
            type: 'date',
            store: true
          },
          _parent_id: {
            type: 'keyword',
            store: true
          },
          description: {
            type: 'text',
          },
          indexPath: {
            type: 'keyword',
            index: false,
            store: true
          },
          inxdFields: {
            type: 'keyword',
            index: false,
            store: true
          },
          srtTitle: {
            type: 'keyword',
            index: false,
            store: true
          }
        },
        dynamic_templates: [
          {
            fa_text_content: {
              match: 'fa_content*',
              match_mapping_type: 'string',
              mapping: {
                type: 'text'
              }
            }
          },
          {
            fa_path: {
              match: 'fa_path*',
              match_mapping_type: 'string',
              mapping: {
                store: true,
                type: 'keyword'
              }
            }
          }
        ],
        _source: {
          excludes: [
            'fa_content*'
          ]
        },
      },
      settings: {
        analysis: {
          analyzer: {
            default_search: {
              type: 'standard',
              stopwords_path: 'en_id.txt'
            },
            default: {
              type: 'standard',
              stopwords_path: 'en_id.txt'
            }
          }
        }
      }
    }
  }

  createUserIndexBody(): any {
    return {
      mappings: {
        properties: {
          createTime: {
            type: 'date',
            store: true
          },
          join_field: {
            type: 'join',
            relations: {
              user: 'folder'
            }
          }
        },
        dynamic_templates: [
          {
            access_control: {
              match: 'access',
              match_mapping_type: 'long',
              mapping: {
                store: true,
                type: 'integer'
              }
            }
          },
          {
            user_pswd: {
              match: 'passwd',
              match_mapping_type: 'string',
              mapping: {
                store: true,
                type: 'keyword'
              }
            }
          },
          {
            folder_id: {
              match: '_folder_id',
              match_mapping_type: 'string',
              mapping: {
                store: true,
                type: 'keyword'
              }
            }
          },
          {
            _name: {
              match: 'name',
              match_mapping_type: 'string',
              mapping: {
                type: 'text',
                fields: {
                  keyword: {
                    type: 'keyword',
                    ignore_above: 256,
                    store: true
                  }
                }
              }
            }
          }
        ]
      },
      settings: {
        analysis: {
          analyzer: {
            default_search: {
              type: 'standard',
              stopwords_path: 'en_id.txt'
            },
            default: {
              type: 'standard',
              stopwords_path: 'en_id.txt'
            }
          }
        }
      }
    }
  }

  createFolderIndexBody() {
    const body = {
      mappings: {
        properties: {
          name: {
            type: 'keyword',
          },
          label: {
            type: 'keyword',
            meta: {
              resultTitle: 'yes'
            },
            // fields: {
            //   keyword: {
            //     type: 'keyword',
            //     ignore_above: 256
            //   }
            // },
            // store: true,
          },
          description: {
            type: 'text',
          },
          createTime: {
            type: 'date'
          },
          fpath: {
            type: 'text',
            fields: {
              keyword: {
                type: 'keyword'
              }
            },
            analyzer: 'breadcrumb',
            store: true
          },
          _parent_id: {
            type: 'keyword',
            store: true
          },
          level: {
            type: 'integer',
            store: true
          },
          indexPath: {
            type: 'keyword',
            store: true,
            index: false
          },
          inxdFields: {
            type: 'keyword',
            store: true,
            index: false
          },
          srtTitle: {
            type: 'keyword',
            store: true,
            index: false
          }
        }
      },
      settings: {
        analysis: {
          tokenizer: {
            breadcrumb_path_hierarchy: {
              type: 'path_hierarchy',
              delimiter: '>'
            }
          },
          analyzer: {
            default_search: {
              // type: 'custom',    --> optional
              tokenizer: 'standard',
              stopwords_path: 'en_id.txt',
              filter: ['trim', 'lowercase']
            },
            default: {
              // type: 'custom',
              tokenizer: 'standard',
              stopwords_path: 'en_id.txt',
              filter: ['trim', 'lowercase']
            },
            breadcrumb: {
              type: 'custom',
              tokenizer: 'breadcrumb_path_hierarchy',
              filter: ['trim', 'lowercase']
            }
          }
        }
      }
    }
    return body;
  }

  getFolders() {
    return {
      data:
          [
            {
              label: 'Documents',
              data: 'Documents Folder',
              expandedIcon: 'pi pi-folder-open',
              collapsedIcon: 'pi pi-folder',
              children: [{
                label: 'Work',
                data: 'Work Folder',
                expandedIcon: 'pi pi-folder-open',
                collapsedIcon: 'pi pi-folder',
                children: [{label: 'Expenses.doc', icon: 'pi pi-file', data: 'Expenses Document'},
                  {label: 'Resume.doc', icon: 'pi pi-file', data: 'Resume Document'}]
              },
                {
                  label: 'Home',
                  data: 'Home Folder',
                  expandedIcon: 'pi pi-folder-open',
                  collapsedIcon: 'pi pi-folder',
                  children: [{label: 'Invoices.txt', icon: 'pi pi-file', data: 'Invoices for this month'}]
                }]
            },
            {
              label: 'Pictures',
              data: 'Pictures Folder',
              expandedIcon: 'pi pi-folder-open',
              collapsedIcon: 'pi pi-folder',
              children: [
                {label: 'barcelona.jpg', icon: 'pi pi-image', data: 'Barcelona Photo'},
                {label: 'logo.jpg', icon: 'pi pi-file', data: 'PrimeFaces Logo'},
                {label: 'primeui.png', icon: 'pi pi-image', data: 'PrimeUI Logo'}]
            },
            {
              label: 'Movies',
              data: 'Movies Folder',
              expandedIcon: 'pi pi-folder-open',
              collapsedIcon: 'pi pi-folder',
              children: [{
                label: 'Al Pacino',
                data: 'Pacino Movies',
                children: [{label: 'Scarface', icon: 'pi pi-video', data: 'Scarface Movie'},
                  {label: 'Serpico', icon: 'pi pi-file-video', data: 'Serpico Movie'}]
              },
                {
                  label: 'Robert De Niro',
                  data: 'De Niro Movies',
                  children: [{label: 'Goodfellas', icon: 'pi pi-video', data: 'Goodfellas Movie'},
                    {label: 'Untouchables', icon: 'pi pi-video', data: 'Untouchables Movie'}]
                }]
            }
          ]
    };
  }
}
