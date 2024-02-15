import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './RemedyModal.scss';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { toast } from "react-toastify";
import moment from 'moment';
import { CommonUtils } from '../../../utils';

class RemedyModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            imgBase64: ''
        }
    }

    async componentDidMount() {
        if (this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email
            })
        }
    }

    componentDidUpdate(preProps, prevState, snapshot) {
        if (preProps.dataModal !== this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email
            })
        }
    }

    handleOnchangeEmail = (event) => {
        this.setState({
            email: event.target.value
        })
    }

    handleOnchangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imgBase64: base64
            })
        }
    }

    handleSendRemedy = () => {
        // console.log('ngocduyyyy: check state modal: ', this.state)
        this.props.sendRemedy(this.state)
    }

    render() {
        let { isOpenModal, closeRemedyModal, dataModal, sendRemedy } = this.props;
        return (
            <Modal
                isOpen={isOpenModal}
                className={'booking-modal-container'}
                size="lg"
                centered
            // backdrop={true}
            >
                <div className="modal-header">
                    <h5 className="modal-title">Gửi hóa đơn khám bệnh</h5>
                    <button type="button" className="close" aria-label="Close" onClick={closeRemedyModal}>
                        <span aria-hidden="true">x</span>
                    </button>
                </div>
                <ModalBody>
                    <div className="row">
                        <div className="col-6 form-group">
                            <label>Email bệnh nhân</label>
                            <input className="form-control" type="email" value={this.state.email}
                                onChange={(event) => this.handleOnchangeEmail(event)}
                            />
                        </div>
                        <div className="col-6 form-group">
                            <label>Chọn file đơn thuốc</label>
                            <input className="form-control-file" type="file"
                                onChange={(event) => this.handleOnchangeImage(event)}
                            ></input>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        style={{
                            backgroundColor: '#28a745',
                            color: '#fff',
                            borderRadius: '5px',
                            padding: '10px 20px',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                            display: 'flex',  // Flex container
                            alignItems: 'center'  // Center vertically
                        }}
                        onClick={() => this.handleSendRemedy()}
                    >
                        Send
                    </Button>
                    <Button
                        style={{
                            backgroundColor: '#dc3545',
                            color: '#fff',
                            borderRadius: '5px',
                            padding: '10px 20px',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                        onClick={closeRemedyModal}
                    >
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);
