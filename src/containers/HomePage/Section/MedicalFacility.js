import React, { Component } from 'react';
import { connect } from 'react-redux';
import './MedicalFacility.scss';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import { getAllClinic } from '../../../services/userService';
import { withRouter } from 'react-router';

class MedicalFacility extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dataClinics: []
        }
    }

    async componentDidMount() {
        let res = await getAllClinic();
        if (res && res.errCode === 0) {
            this.setState({
                dataClinics: res.data ? res.data : []
            })
        }
        console.log('ngocduyyy check res clinic : ', res)
    }

    handleViewDetailClinic = (clinic) => {
        if (this.props.history) {
            this.props.history.push(`/detail-clinic/${clinic.id}`)
        }
    }

    handleMoreInfoButtonClick = () => {
        if (this.props.history) {
            this.props.history.push('/facilities'); // Thay đổi '/your-target-page' bằng đường dẫn trang bạn muốn chuyển đến
        }
    };

    render() {
        let { dataClinics } = this.state;
        return (
            <div className="section-share section-medical-facility">
                <div className="section-container">
                    <div className="section-header">
                        <span className="title-section"> <FormattedMessage id="hompage.medical-facility" /> </span>
                        <button className="btn-section" onClick={this.handleMoreInfoButtonClick}><FormattedMessage id="hompage.more-infor" /></button>
                    </div>
                    <div className="section-body">
                        <Slider {...this.props.settings}>
                            {dataClinics && dataClinics.length > 0 &&

                                dataClinics.map((item, index) => {
                                    return (
                                        <div className="section-customize clinic-child"
                                            key={index}
                                            onClick={() => this.handleViewDetailClinic(item)}
                                        >
                                            <div className="bg-image section-medical-facility"
                                                style={{
                                                    backgroundImage: `url(${item.image})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                    width: '100%', // Adjust as needed
                                                    height: '170px', // Adjust as needed
                                                    borderRadius: '10px', // Adjust as needed
                                                }}
                                            />
                                            <div className="clinic-name">{item.name}</div>
                                        </div>
                                    )
                                })
                            }
                        </Slider>
                    </div>

                </div>
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicalFacility));
