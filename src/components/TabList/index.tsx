import React, { ReactNode, useEffect, useState } from 'react';
import './index.less';

export type ListItem = {
    key: string;
    label: string | ReactNode;
};

interface TabListProps {

    /**
     * list内容
     */
    items: ListItem[];
    /**
     * key值
     */
    activeKey: string;

    /**
     * onChange
     */
    onChange: (key: string) => void;
}

export default function TabList({
    activeKey,
    items = [],
    onChange,
}: TabListProps) {
    return (
        <div className="flow-TabList">
            {(items || []).map((tab) =>
                <div key={tab.key}
                    className={`flow-TabList-title ${activeKey == tab.key ? 'flow-TabList-active' : ''}`}
                    onClick={() => onChange(tab.key)}
                >
                    {tab.label} </div>
            )}
        </div>
    );
}
