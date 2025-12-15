import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { useNavigate } from 'react-router-dom';
import axios from '@/lib/axiosConfig';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Actions from '@/components/common/Actions';
import { SearchAndAddBar } from '@/components/common/SearchAndAdd';
import { Tag } from 'antd';
import type { Column } from '@/types/Table';
import type { User } from '@/types/User';
import TableData from '@/components/common/Table';
import { getUser, setTableParams, setKeyword } from '@/redux/slices/userSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHook';
import { selectUserData } from '@/redux/selectors/userSelector';
import { useTranslation } from 'react-i18next';

export default function Users() {
  const { t, i18n } = useTranslation(['user', 'common', 'validation']);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const breadcrumbItems = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Khách hàng', path: '/users' },
  ];
  const { tableParams } = useAppSelector((state) => state.user);
  const columns: Column<User>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      render: (_: unknown, __: User, index: number) =>
        (tableParams.pagination!.current! - 1) *
          tableParams.pagination!.pageSize! +
        index +
        1,
    },
    {
      title: t('user:field.name'),
      dataIndex: 'name',
      sorter: true,
      search: true,
    },
    {
      title: t('user:field.dob'),
      dataIndex: 'dob',
      sorter: true,
      search: true,
    },
    {
      title: t('user:field.gender'),
      dataIndex: 'gender',
      filters: [
        { text: 'Nam', value: '1' },
        { text: 'Nữ', value: '0' },
      ],
      filterMultiple: false,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      search: true,
    },
    {
      title: t('user:field.phone'),
      dataIndex: 'phone_number',
      search: true,
    },
    {
      title: t('user:field.address'),
      dataIndex: 'address',
      search: true,
    },
    {
      title: t('common:status'),
      dataIndex: 'state',
      filters: [
        { text: 'Hoạt động', value: '1' },
        { text: 'Chặn', value: '0' },
      ],
      filterMultiple: false,
      render: (_: unknown, record: User) => (
        <Tag color={record.state === 'Hoạt động' ? 'green' : 'red'}>
          {record.state}
        </Tag>
      ),
    },
    {
      title: t('common:action'),
      fixed: 'right',
      render: (_: unknown, record: User) => (
        <Actions
          onEdit={() => navigate(`/users/edit-user/${record.id}`)}
          onDelete={() => handleDeleteUser(record.id)}
        />
      ),
    },
  ];

  const handleSearch = (value: string) => {
    dispatch(setKeyword(value));
  };

  const handleDeleteUser = async (id: number) => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`/users/${id}`);
      toast.success('Xóa người dùng thành công!');
      dispatch(getUser());
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
      toast.error('Xóa người dùng thất bại!');
    }
  };

  return (
    <>
      <PageBreadcrumb items={breadcrumbItems} />
      <div className="rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-white/3 lg:p-6 w-full h-full flex flex-col flex-1">
        <div className="space-y-2 md:space-y-4 flex flex-col h-full">
          <SearchAndAddBar
            placeholder="Tìm kiếm..."
            onSearch={handleSearch}
            onAdd={() => {
              navigate('/users/add-user');
            }}
          />
          <div className="w-full flex flex-col h-full flex-1">
            <TableData<User>
              columns={columns}
              selector={selectUserData}
              actionFetch={getUser}
              actionSetParams={setTableParams}
            />
          </div>
        </div>
      </div>
    </>
  );
}
