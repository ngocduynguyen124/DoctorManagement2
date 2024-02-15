import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { getAllSpecialty } from '../../services/userService';
import { withRouter } from 'react-router';
import HomeHeader from '../HomePage/HomeHeader';
import HomeFooter from './HomeFooter';
import './specialties.scss';

class specialties extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSpecialty: []
        };
    }

    async componentDidMount() {
        try {
            const res = await getAllSpecialty();
            console.log('Ngoc Duy check res:', res);

            if (res && res.errCode === 0) {
                this.setState({
                    dataSpecialty: res.data || []
                });
            }
        } catch (error) {
            console.error('Error fetching specialty:', error);
        }
    }

    handleViewDetailSpecialty = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/${item.id}`);
        }
    }

    render() {
        const { dataSpecialty } = this.state;

        return (
            <>
                <HomeHeader />
                <div className="section-specialty-2">
                    <h2 className="title2-"> <FormattedMessage id="hompage.all-specialties" /> </h2>
                </div>
                <div className="section-body-2">
                    {dataSpecialty && dataSpecialty.length > 0 &&
                        dataSpecialty.map((item, index) => (
                            <div
                                className="section-customize-2 specialty-child-2"
                                key={index}
                                onClick={() => this.handleViewDetailSpecialty(item)}
                            >
                                {/* Display the image directly using an <img> tag */}
                                <img
                                    className="bg-image-2 section-specialty-image-2"
                                    src={item.image}
                                    alt={item.name}
                                />
                                <div className="divider"></div>
                                <div className="specialty-name-2">{item.name}</div>
                            </div>
                        ))
                    }
                </div>
                <HomeFooter />
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(specialties));
