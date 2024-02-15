import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './TableManageUser.scss';
import * as actions from "../../../store/actions"
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import './ManageDoctor.scss';
import Select from 'react-select';
import { LANGUAGES, CRUD_ACTIONS } from "../../../utils";
import { getDetailInforDoctor } from "../../../services/userService";


const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contentMarkDown: '',
            contentHTML: '',
            selectedOption: '',
            description: '',
            listDoctors: [],
            hasOldData: false,


            //save to doctor_infor table
            listPrice: [],
            listPayment: [],
            listProvince: [],
            listClinic: [],
            listSpecialty: [],

            selectedPrice: '',
            selectedPayment: '',
            selectedProvince: '',
            selectedClinic: '',
            selectedSpecialty: '',

            nameClinic: '',
            addressClinic: '',
            note: '',
            clinicId: '',
            specialtyId: ''
        }
    }

    componentDidMount() {
        this.props.fetchAllDoctors();
        this.props.getAllRequiredDoctorInfor();
    }

    buildDataInputSelect = (inputData, type) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            if (type === 'USERS') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.lastName} ${item.firstName}`;
                    let labelEn = `${item.firstName} ${item.lastName}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.id;
                    result.push(object)
                })
            }
            if (type === 'PRICE') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVi}`;
                    let labelEn = `${item.valueEn} USD`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object)
                })
            }
            if (type === 'PAYMENT' || type === 'PROVINCE') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVi}`;
                    let labelEn = `${item.valueEn}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object)
                })
            }
            if (type === 'SPECIALTY') {
                inputData.map((item, index) => {
                    let object = {};
                    object.label = item.name;
                    object.value = item.id;
                    result.push(object)
                })
            }
            if (type === 'CLINIC') {
                inputData.map((item, index) => {
                    let object = {};
                    object.label = item.name;
                    object.value = item.id;
                    result.push(object)
                })
            }
        }

        return result;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS')

            this.setState({
                listDoctors: dataSelect
            })
        }

        if (prevProps.allRequiredDoctorInfor !== this.props.allRequiredDoctorInfor) {
            console.log(">>> ngocduy get data from redux", this.props.allRequiredDoctorInfor)

            let { resPayment, resPrice, resProvince, resSpecialty, resClinic } = this.props.allRequiredDoctorInfor;

            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT');
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE');
            let dataSelectSpecialty = this.buildDataInputSelect(resSpecialty, 'SPECIALTY')
            let dataSelectClinic = this.buildDataInputSelect(resClinic, "CLINIC")

            console.log('ngocudyfu343 new:', dataSelectPrice, dataSelectPayment, dataSelectProvince)

            this.setState({
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
                listSpecialty: dataSelectSpecialty,
                listClinic: dataSelectClinic
            })
        }

        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS')
            let { resPayment, resPrice, resProvince } = this.props.allRequiredDoctorInfor;
            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT');
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE');
            this.setState({
                listDoctors: dataSelect,
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince
            })
        }
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkDown: text,
            contentHTML: html
        })
        console.log('handleEditorChange', html, text);
    }

    handleSaveContentMarkdown = () => {
        let { hasOldData } = this.state;
        this.props.saveDetailDoctor({
            contentHTML: this.state.contentHTML,
            contentMarkDown: this.state.contentMarkDown,
            description: this.state.description,
            doctorId: this.state.selectedOption.value,
            action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,

            selectedPrice: this.state.selectedPrice.value,
            selectedPayment: this.state.selectedPayment.value,
            selectedProvince: this.state.selectedProvince.value,
            nameClinic: this.state.nameClinic,
            addressClinic: this.state.addressClinic,
            note: this.state.note,
            clinicId: this.state.selectedClinic && this.state.selectedClinic.value ? this.state.selectedClinic.value : '',
            specialtyId: this.state.selectedSpecialty.value
        })
        console.log('ngocduy 12433424: ', this.state)
    }

    handleChangeSelect = async (selectedOption) => {
        this.setState({ selectedOption });

        let { listPayment, listPrice, listProvince, listSpecialty, listClinic } = this.state;

        let res = await getDetailInforDoctor(selectedOption.value);

        if (res && res.errCode === 0 && res.data && res.data.Markdown) {
            let markdown = res.data.Markdown;

            let addressClinic = '', nameClinic = '', note = '',
                paymentId = '', priceId = '', provinceId = '', clinicId = '',
                selectedPayment = '', selectedProvince = '', selectedPrice = '', selectedSpecialty = '', selectedClinic = '';

            if (res.data.Doctor_Infor) {
                addressClinic = res.data.Doctor_Infor.addressClinic;
                nameClinic = res.data.Doctor_Infor.nameClinic;
                note = res.data.Doctor_Infor.note;

                paymentId = res.data.Doctor_Infor.paymentId;
                priceId = res.data.Doctor_Infor.priceId;
                provinceId = res.data.Doctor_Infor.provinceId;
                clinicId = res.data.Doctor_Infor.clinicId;
                selectedSpecialty = listSpecialty.find(item => item && item.value === res.data.Doctor_Infor.specialtyId);

                selectedPayment = listPayment.find(item => item && item.value === paymentId);
                selectedPrice = listPrice.find(item => item && item.value === priceId);
                selectedProvince = listProvince.find(item => item && item.value === provinceId);
                selectedClinic = listClinic.find(item => item && item.value === clinicId);
            }

            this.setState({
                contentHTML: markdown.contentHTML,
                contentMarkDown: markdown.contentMarkDown,
                description: markdown.description,
                hasOldData: true,
                addressClinic: addressClinic,
                nameClinic: nameClinic,
                note: note,
                selectedPayment: selectedPayment,
                selectedPrice: selectedPrice,
                selectedProvince: selectedProvince,
                selectedSpecialty: selectedSpecialty,
                selectedClinic: selectedClinic  // Update the state for selectedSpecialty
            });
        } else {
            this.setState({
                contentHTML: '',
                contentMarkDown: '',
                description: '',
                hasOldData: false,
                addressClinic: '',
                nameClinic: '',
                note: '',
                selectedPayment: '',
                selectedPrice: '',
                selectedProvince: '',
                selectedSpecialty: '',
                selectedClinic: ''  // Clear the selectedSpecialty when no data is available
            });
        }
    };


    handleChangeSelectDoctorInfor = async (selectedOption, name) => {
        let stateName = name.name;
        let stateCopy = { ...this.state };
        stateCopy[stateName] = selectedOption;

        this.setState({
            ...stateCopy
        })
        console.log(" ngocduy check new select on change: ", selectedOption, name)
    }

    handleOnChangeText = (event, id) => {
        let stateCopy = { ...this.state };
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy
        })
    }
    render() {
        let { hasOldData, listSpecialty } = this.state;

        // selectedPrice: '',
        //     selectedPayment: '',
        //     selectedProvince: '',
        console.log("ngocduy73743874:", this.state);
        return (
            <div className="manage-doctor-container">
                <div className="manage-doctor-title">
                    < FormattedMessage id="admin.manage-doctor.title" />
                </div>
                <div className="more-infor">
                    <div className="content-left form-group">
                        <label>< FormattedMessage id="admin.manage-doctor.select-doctor" /></label>
                        <Select
                            value={this.state.selectedOption}
                            onChange={this.handleChangeSelect}
                            options={this.state.listDoctors}
                            placeholder={< FormattedMessage id="admin.manage-doctor.select-doctor" />}
                        />
                    </div>
                    <div className="content-right">
                        <label>< FormattedMessage id="admin.manage-doctor.intro" /></label>
                        <textarea className="form-control" rows="4"
                            onChange={(event) => this.handleOnChangeText(event, 'description')}
                            value={this.state.description}
                        >

                        </textarea>
                    </div>
                </div>
                <div className="more-infor-extra row">
                    <div className="col-4 form-group">
                        <label>< FormattedMessage id="admin.manage-doctor.price" /></label>
                        <Select
                            value={this.state.selectedPrice}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listPrice}
                            placeholder={< FormattedMessage id="admin.manage-doctor.price" />}
                            name="selectedPrice"
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label>< FormattedMessage id="admin.manage-doctor.payment" /></label>
                        <Select
                            value={this.state.selectedPayment}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listPayment}
                            placeholder={< FormattedMessage id="admin.manage-doctor.payment" />}
                            name="selectedPayment"
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label>< FormattedMessage id="admin.manage-doctor.province" /></label>
                        <Select
                            value={this.state.selectedProvince}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listProvince}
                            placeholder={< FormattedMessage id="admin.manage-doctor.province" />}
                            name="selectedProvince"
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label>< FormattedMessage id="admin.manage-doctor.nameClinic" /></label>
                        <input className="form-control"
                            onChange={(event) => this.handleOnChangeText(event, 'nameClinic')}
                            value={this.state.nameClinic}
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label>< FormattedMessage id="admin.manage-doctor.addressClinic" /></label>
                        <input className="form-control"
                            onChange={(event) => this.handleOnChangeText(event, 'addressClinic')}
                            value={this.state.addressClinic}
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label>< FormattedMessage id="admin.manage-doctor.note" /></label>
                        <input className="form-control"
                            onChange={(event) => this.handleOnChangeText(event, 'note')}
                            value={this.state.note}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-4 form-group">
                        <label>< FormattedMessage id="admin.manage-doctor.specialty" /></label>
                        <Select
                            value={this.state.selectedSpecialty}
                            options={this.state.listSpecialty}
                            placeholder={< FormattedMessage id="admin.manage-doctor.specialty" />}
                            onChange={this.handleChangeSelectDoctorInfor}
                            name="selectedSpecialty"
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label>< FormattedMessage id="admin.manage-doctor.select-clinic" /></label>
                        <Select
                            value={this.state.selectedClinic}
                            options={this.state.listClinic}
                            placeholder={< FormattedMessage id="admin.manage-doctor.select-clinic" />}
                            onChange={this.handleChangeSelectDoctorInfor}
                            name="selectedClinic"
                        />
                    </div>
                </div>
                <div className='manage-doctor-editor'>
                    <MdEditor
                        style={{ height: '300px' }}
                        renderHTML={text => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        value={this.state.contentMarkDown}
                    />
                </div>
                <button className={hasOldData === true ? "save-content-doctor" : "create-content-doctor"} onClick={() => this.handleSaveContentMarkdown()}>
                    {hasOldData === true ?
                        <span>< FormattedMessage id="admin.manage-doctor.save" /></span>
                        :
                        <span>< FormattedMessage id="admin.manage-doctor.add" /></span>
                    }
                </button>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
        allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        getAllRequiredDoctorInfor: () => dispatch(actions.getRequiredDoctorInfor()),
        saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
