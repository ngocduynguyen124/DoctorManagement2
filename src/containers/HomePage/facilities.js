import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { getAllClinic } from '../../services/userService';
import { withRouter } from 'react-router';
import HomeHeader from '../HomePage/HomeHeader';
import HomeFooter from './HomeFooter';
import './facilities.scss';

class facilities extends Component {

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

    render() {
        let { dataClinics } = this.state;
        return (
            <>
                <HomeHeader />
                <div className="section-specialty-3">
                    <h2 className="title-section-3"><FormattedMessage id="hompage.all-medical-facilities" /></h2>
                </div>
                <div className="section-body-3">
                    {dataClinics && dataClinics.length > 0 &&
                        dataClinics.map((item, index) => {
                            return (
                                <div
                                    className="section-customize-3 clinic-child-3"
                                    key={index}
                                    onClick={() => this.handleViewDetailClinic(item)}
                                >
                                    <div
                                        className="bg-image-3 section-medical-facility-3"
                                        style={{
                                            backgroundImage: `url(${item.image})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            width: '90%', // Adjust as needed
                                            height: '140px', // Adjust as needed
                                            borderRadius: '10px', // Adjust as needed
                                        }}
                                    />
                                    <div className="clinic-name-3">{item.name}</div>
                                </div>
                            );
                        })}
                </div>
                {/* <HomeFooter /> */}
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(facilities));
