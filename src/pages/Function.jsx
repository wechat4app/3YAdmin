import React from 'react';
import { Row, Col, Input, Button, Switch, InputNumber, message, Tag, Icon, Table, Popconfirm, Divider } from 'antd';
import {
    getFunctionPagedList,
    delFunction,
    delFunctions,
    saveFunction
} from 'api';
import SearchForm from '@/schema/SearchForm';
import schema from '@/schema/function';

const columns = [{
    title: '模块名称',
    dataIndex: 'module',
    sorter: true,
    width: '30%',
},
{
    title: '功能名称',
    dataIndex: 'name',
    sorter: true,
    width: '30%',
},
{
    title: '功能编码',
    dataIndex: 'code',
    width: '30%',
    sorter: true
},
{
    title: '操作',
    dataIndex: 'id',
    width: '10%',
    render: (text, record) => {
        return <div>
            <a
                href="javascript:;"
                onClick={this.edit}

            >
                编辑
            </a>
            <Divider type="vertical" />
            <Popconfirm title="确定删除?" onConfirm={this.onDelete}>
                <a href="javascript:;">删除</a>
            </Popconfirm>
        </div>
    }
}];

class Function extends React.PureComponent {
    state = {
        filter: {
            module: "",
            name: "",
            code: ""
        },
        expand: true,
        pagedList: [],
        pagination: {
            current: 1,
            pageSize: 10,
            showQuickJumper: true,
            showSizeChanger: true,
        },
        sorter: {
            field: '',
            order: ''
        },
        loading: false
    };
    fetch = async (query = {}) => {
        this.setState({ loading: true });
        let dataRes = await getFunctionPagedList(query);
        let data = dataRes.data;
        const pagination = { ...this.state.pagination };
        pagination.total = data.totalCount;
        this.setState({
            loading: false,
            pagedList: data.rows,
            pagination,
        });
    }
    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        pager.pageSize = pagination.pageSize;
        this.setState({
            pagination: pager,
            sorter: {
                field: sorter.field,
                order: sorter.order
            }
        });
        let query = {
            pageIndex: pager.current,
            pageSize: pager.pageSize,
            sortBy: sorter.field,
            descending: sorter.order === 'descend',
            filter: this.state.filter
        };
        this.fetch(query);
    }
    handleSearch = (filter) => {
        const pager = { ...this.state.pagination };
        pager.current = 1;//查询回到第一页
        this.setState({
            filter: filter,
            pagination: pager
        });
        let query = {
            pageIndex: this.state.pagination.current,
            pageSize: this.state.pagination.pageSize,
            sortBy: this.state.sorter.field,
            descending: this.state.order === 'descend',
            filter: filter
        };
        this.fetch(query);
    }
    handleReset = () => {
        this.setState({
            filter: {}
        });
    }
    edit = () => {
        alert(1212);
    }
    componentDidMount() {
        this.fetch({
            pageIndex: this.state.pagination.current,
            pageSize: this.state.pagination.pageSize,
            filter: this.state.filter
        });
    }
    render() {
        console.log("Function render")
        return (
            <div>
                <SearchForm schema={schema.schema} uiSchema={schema.uiSchema} handleSubmit={this.handleSearch} handleReset={this.handleReset} />
                <Table columns={columns}
                    rowKey={record => record.id}
                    dataSource={this.state.pagedList}
                    pagination={this.state.pagination}
                    loading={this.state.loading}
                    onChange={this.handleTableChange}
                />
            </div>
        );
    }
}

export default Function;
