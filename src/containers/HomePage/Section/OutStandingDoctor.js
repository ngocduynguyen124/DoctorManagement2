import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import * as actions from '../../../store/actions';
import { LANGUAGES } from '../../../utils';
import { withRouter } from 'react-router';

class OutStandingDoctor extends Component {

    constructor(props) {
        super(props)
        this.state = {
            arrDoctors: []
        }
    }

    componentDidUpdate(preProps, prevState, snapshot) {
        if (preProps.topDoctorsRedux !== this.props.topDoctorsRedux) {
            this.setState({
                arrDoctors: this.props.topDoctorsRedux
            })
        }
    }

    componentDidMount() {
        this.props.loadTopDoctors();

    }

    handleViewDetailDoctor = (doctor) => {
        if (this.props.history) {
            this.props.history.push(`/detail-doctor/${doctor.id}`)
        }
    }

    handleHoverEnter = (event) => {
        event.target.style.color = '#45c3d2'; // Customize the hover styles as needed
    };

    handleHoverLeave = (event) => {
        event.target.style.color = ''; // Reset to the default style
    };

    handleMoreInfoButtonClick = () => {
        if (this.props.history) {
            this.props.history.push('/doctors'); // Thay đổi '/your-target-page' bằng đường dẫn trang bạn muốn chuyển đến
        }
    };

    render() {
        let arrDoctors = this.state.arrDoctors;
        let { language } = this.props;
        // arrDoctors = arrDoctors.concat(arrDoctors).concat(arrDoctors).concat(arrDoctors).concat(arrDoctors);
        console.log('ngocduyyyyyyyyyyyyy12122423:', arrDoctors)
        return (
            <div className="section-share section-outstanding-doctor">
                <div className="section-container">
                    <div className="section-header">
                        <span className="title-section">
                            <FormattedMessage id="hompage.outstanding-doctor" />
                        </span>
                        <button className="btn-section" onClick={this.handleMoreInfoButtonClick}><FormattedMessage id="hompage.more-infor" /></button>
                    </div>
                    <div className="section-body">
                        <Slider {...this.props.settings}>
                            {
                                arrDoctors && arrDoctors.length > 0
                                && arrDoctors.map((item, index) => {
                                    let imageBase64 = '';
                                    if (item.image) {
                                        imageBase64 = new Buffer(item.image, 'base64').toString('binary');
                                    }
                                    let nameVi = `${item.positionData.valueVi}, ${item.lastName} ${item.firstName} `;
                                    let nameEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}`;
                                    return (
                                        <div className="section-customize" key={index} onClick={() => this.handleViewDetailDoctor(item)}>
                                            <div className="customize-border">
                                                <div className="outer-bg">
                                                    <div className="bg-image section-outstanding-doctor"
                                                        style={{ backgroundImage: `url(${imageBase64})` }}
                                                    />
                                                </div>
                                                <div className="position text-center doctor-title">
                                                    <div className="name-doctor"
                                                        onMouseEnter={this.handleHoverEnter}
                                                        onMouseLeave={this.handleHoverLeave}>
                                                        {language === LANGUAGES.EN ? nameEn : nameVi}
                                                    </div>
                                                    {/* <div>Cơ Xương Khớp</div> */}
                                                </div>
                                            </div>
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
        language: state.app.language,
        isLoggedIn: state.user.isLoggedIn,
        topDoctorsRedux: state.admin.topDoctors
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadTopDoctors: () => dispatch(actions.fetchTopDoctor())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor));
