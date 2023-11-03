import { getAllCategory, getBatchesByCategoryId } from '@/services/batch';
import { DownOutlined } from '@ant-design/icons';
import { Cascader } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import { cloneDeep } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import originStyles from './index.less';
import { mergeStyles } from '@/utils';

const NoBatchAssigned = 'NoBatchAssigned';

// type OptionValueType = string | number | null;
type OptionType = {
  batchId: string;
  name: React.ReactNode;
  children?: OptionType[];
  isLeaf?: boolean;
  disabled?: boolean;
  categoryId?: string;
  categoryName?: string;
};
export type selectedOptionType = {
  batchId: string;
  name: string;
  categoryId?: string;
  categoryName?: string;
};
/**
 * @param value 当前选中的batch的id，包含batchCategory父子关系，用于Cascader动态可控，格式同Cascader.value
 * @param options 当前选中的batch的详细信息，即包含name等信息的对象数组，无父子关系
 */
export type SelectedBatchType = {
  value?: string[];
  options?: selectedOptionType[];
};
interface Props {
  selected?: SelectedBatchType;
  onSelectedChange?: (selected: SelectedBatchType) => void;
  multiple?: boolean;
  noBatchAssigned?: boolean;
  classname?: Record<string, string>;
  dropdownRender?: any;
}

export default function BtachCascader({
  selected,
  onSelectedChange,
  multiple,
  noBatchAssigned,
  classname,
  dropdownRender,
}: Props) {
  const [options, setOptions] = useState<OptionType[]>([]);
  const styles = useMemo(
    () => mergeStyles(originStyles, classname),
    [mergeStyles, originStyles, classname],
  );
  useEffect(() => {
    getAllCategory().then((res) => {
      setOptions(
        res.map((item: any) => ({
          batchId: item.batchCategoryId,
          name: item.name,
          isLeaf: false,
        })),
      );
    });
  }, []);

  const loadData = (selectedOptions: OptionType[] | DefaultOptionType[]) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    if (targetOption.children || !targetOption.batchId) return;

    getBatchesByCategoryId({
      categoryId: targetOption.batchId,
      isTemplate: false,
    }).then((res) => {
      targetOption.children = res.map((item: any) => ({
        batchId: item.batchId,
        name: item.name,
      }));
      setOptions(cloneDeep(options));
    });
  };

  function isTwoArray(arr: any[]) {
    return arr?.some((items) => Array.isArray(items));
  }

  function onChange(value: any[], selectedOptions: any[]) {
    // 选择noBatchAssigned
    if (noBatchAssigned && value.some((i) => i.includes(NoBatchAssigned))) {
      onSelectedChange?.({
        value: [],
        options: [
          {
            categoryId: 'noBatchAssigned',
            categoryName: 'noBatchAssigned',
            batchId: 'noBatchAssigned',
            name: 'noBatchAssigned',
          },
        ],
      });
      return;
    }
    const selectedBatch: selectedOptionType[] = [];
    // 多选
    if (isTwoArray(selectedOptions)) {
      (selectedOptions as selectedOptionType[][]).forEach((item) => {
        // 只保留有batch的category
        if (item.length > 1) {
          const category = item[0];
          const leaf = item[1]; // 其实length只能是2，即category和batch共2层，叶子节点位于最后一层，所以取length - 1固定为1
          selectedBatch.push({
            categoryId: category.batchId,
            categoryName: category.name,
            batchId: leaf.batchId as string,
            name: leaf.name as string,
          });
        }
      });
    } else {
      // 单选
      const option = selectedOptions as selectedOptionType[];
      selectedBatch.push({
        categoryId: option[0].batchId,
        categoryName: option[0].name,
        batchId: option[1].batchId,
        name: option[1].name,
      });
    }
    onSelectedChange?.({ value, options: selectedBatch });
  }

  return (
    <div className={styles.wrap}>
      <Cascader
        fieldNames={{ value: 'batchId', label: 'name' }}
        options={
          noBatchAssigned
            ? [
                {
                  name: 'No Batch Assigned',
                  batchId: NoBatchAssigned,
                  isLeaf: true,
                },
                ...options,
              ]
            : options
        }
        loadData={loadData}
        onChange={onChange}
        multiple={multiple}
        changeOnSelect={false}
        showCheckedStrategy={Cascader.SHOW_CHILD}
        expandTrigger="hover"
        value={selected?.value}
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
        popupClassName={styles.cascader}
        dropdownRender={dropdownRender}
      >
        <div className={styles.rootbox}>
          <span>Batch</span>
          <DownOutlined className={styles.icon} />
        </div>
      </Cascader>
    </div>
  );
}
