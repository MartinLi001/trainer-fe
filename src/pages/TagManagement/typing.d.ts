declare namespace TagManagementI {
  interface TagItemI {
    frequency?: number;
    id: string;
    name: string;
  }
  interface ModalDataI {
    open: boolean;
    type: 'topic' | 'tag' | 'client' | '';
    afterCreate?: (res: any) => void;
    list: TagItemI[];
  }
}
