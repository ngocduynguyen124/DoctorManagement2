import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import * as actions from '../../store/actions';
import { LANGUAGES } from '../../utils';
import { withRouter } from 'react-router';
import HomeHeader from '../HomePage/HomeHeader';
import HomeFooter from './HomeFooter';
import './doctors.scss';

class doctors extends Component {

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

    render() {
        let arrDoctors = this.state.arrDoctors;
        let { language } = this.props;
        console.log('check state', this.state);
        return (
            <>
                <HomeHeader />
                <div className="section-share-6 section-outstanding-doctor-6">
                    <div className="section-container-6">
                        <div className="section-header-6">
                            <span className="title-section-6">
                                <h2> <FormattedMessage id="hompage.all-outstanding-doctors" /> </h2>
                            </span>
                        </div>
                        <div className="section-body-6">
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
                                        <div className="section-customize-6" key={index} onClick={() => this.handleViewDetailDoctor(item)}>
                                            <div className="doctor-list-6">
                                                <div className="doctor-avatar" style={{ backgroundImage: `url(${imageBase64})` }}>
                                                </div>
                                                <div className="all-doctors" style={{ display: 'block' }}>
                                                    <div className="doctor-info"
                                                        onMouseEnter={this.handleHoverEnter}
                                                        onMouseLeave={this.handleHoverLeave}>
                                                        {language === LANGUAGES.EN ? nameEn : nameVi}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <HomeFooter />

                    </div>
                </div>
            </>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(doctors));
