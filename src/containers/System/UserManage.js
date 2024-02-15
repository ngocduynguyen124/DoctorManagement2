import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss';
import { getAllUsers, createNewUserService, deleteUserService, editUserService } from '../../services/userService';
import ModalUser from './ModalUser';
import ModalEditUser from './ModalEditUser';
import { emitter } from '../../utils/emitter';

class UserManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModelUser: false,
            isOpenModelEditUser: false,
            userEdit: {}
        }
    }

    async componentDidMount() {
        //gọi API
        await this.getAllUsersFromReact();
    }

    getAllUsersFromReact = async () => {
        let response = await getAllUsers('ALL');
        if (response && response.errCode === 0) {
            this.setState({
                arrUsers: response.users
            })
        }
    }

    handleAddNewUser = () => {
        this.setState({
            isOpenModelUser: true,
        })
    }

    toggleUserModal = () => {
        this.setState({
            isOpenModelUser: !this.state.isOpenModelUser,
        })
    }

    toggleUserEditModal = () => {
        this.setState({
            isOpenModelEditUser: !this.state.isOpenModelEditUser,
        })
    }

    createNewUser = async (data) => {
        try {
            let response = await createNewUserService(data);
            if (response && response.errCode !== 0) {
                alert(response.errMessage)
            } else {
                await this.getAllUsersFromReact();
                this.setState({
                    isOpenModelUser: false
                })
                emitter.emit('EVENT_CLEAR_MODAL_DATA')
            }
        } catch (error) {
            console.log(error)
        }
    }

    handleDeleteUser = async (user) => {
        try {
            let res = await deleteUserService(user.id);
            if (res && res.errCode == 0) {
                await this.getAllUsersFromReact();
            } else {
                alert(res.errMessage)
            }
        } catch (e) {

        }
    }

    handleEditUser = (user) => {
        console.log('check edit user:', user);
        this.setState({
            isOpenModelEditUser: true,
            userEdit: user
        })
    }

    doEditUser = async (user) => {
        try {
            let res = await editUserService(user);
            if (res && res.errCode === 0) {
                this.setState({
                    isOpenModelEditUser: false
                })

                await this.getAllUsersFromReact()
            } else {
                alert(res.errCode)
            }
        } catch (e) {
            console.log(e)
        }
    }

    render() {

        let arrUsers = this.state.arrUsers;
        return (
            <div className="users-container">
                <ModalUser
                    isOpen={this.state.isOpenModelUser}
                    toggleFromParent={this.toggleUserModal}
                    createNewUser={this.createNewUser}
                />
                {
                    this.state.isOpenModelEditUser &&
                    <ModalEditUser
                        isOpen={this.state.isOpenModelEditUser}
                        toggleFromParent={this.toggleUserEditModal}
                        currentUser={this.state.userEdit}
                        editUser={this.doEditUser}
                    />
                }
                <div className="title text-center mt-3">Manage users with Duyyy</div>
                <div className="mx-2">
                    <button className="btn btn-primary px-3" onClick={() => this.handleAddNewUser()}><i className="fas fa-plus"></i> Add new users</button>
                </div>
                <div className="users-table mt-4">

                    <table id="customers">
                        <tbody>
                            <tr>
                                <th>Email</th>
                                <th>First name</th>
                                <th>Last name</th>
                                <th>Address</th>
                                <th>Actions</th>
                            </tr>
                            {
                                arrUsers && arrUsers.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{item.email}</td>
                                            <td>{item.firstName}</td>
                                            <td>{item.lastName}</td>
                                            <td>{item.address}</td>
                                            <td>
                                                <button className="btn-edit" onClick={() => this.handleEditUser(item)}>
                                                    <i className="fas fa-pencil-alt"></i>
                                                </button>
                                                <button className="btn-delete" onClick={() => this.handleDeleteUser(item)}>
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
