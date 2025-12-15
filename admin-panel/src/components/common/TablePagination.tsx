import { Pagination } from 'antd';
import { useTranslation } from 'react-i18next';
import type { TablePaginationConfig } from 'antd/es/table';
interface TablePaginationProps {
  pagination?: TablePaginationConfig;
  loading?: boolean;
  onChange: (page: number, pageSize: number) => void;
}

export default function TablePagination({
  pagination,
  loading,
  onChange,
}: TablePaginationProps) {
  const { t } = useTranslation(['translation']);

  if (!pagination?.total) return null;

  return (
    <div className="flex justify-end mt-4">
      <Pagination
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={pagination.total}
        showSizeChanger
        showQuickJumper={false}
        disabled={loading}
        size="small"
        onChange={onChange}
        showTotal={(total) =>
          `${t('translation:components.common.BaseTable.total')}: ${total} ${t(
            'translation:components.common.BaseTable.item',
          )}`
        }
      />
    </div>
  );
}
