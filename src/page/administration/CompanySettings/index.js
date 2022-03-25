import { PageHeader, Button, Tooltip, Spin } from "antd";
import { BreadcrumbConfig } from "../../../config/BreadcrumbConfig";
import BreadcrumbComponent from "../../../component/BreadcrumbComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPencilAlt,
	faMapMarkerAlt,
	faUser,
	faPhoneAlt,
	faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import useStore from "../../../store";
import EditCompanyProfileComponent from "./component/EditCompanyProfileComponent";
import EditPreferencesComponent from "./component/EditPreferencesComponent";
import EditLogoImageComponent from "./component/EditLogoImageComponent";
import EditHeroImageComponent from "./component/EditHeroImageComponent";
import EditFavIconComponent from "./component/EditFavIconComponent";
import EditThemeColorComponent from "./component/EditThemeColorComponent";
import EditEmailHeaderComponent from "./component/EditEmailHeaderComponent";
import EditEmailFooterComponent from "./component/EditEmailFooterComponent";
import { CurrencyFormat } from "../../../utils/GlobalFunction";
import { InfoIcon } from "../../../config/IconsConfig";

const CompanySettings = observer((props) => {
	const {
		AUTH,
		CompanySettingStore: { company_data, getList },
	} = useStore();
	const [editCompanyProfileModal, setEditCompanyProfileModal] = useState(false);
	const [editPreferencesModal, setEditPreferencesModal] = useState(false);
	// const { CompanySettings } = useStore();
	const [editLogoImageModal, setEditLogoImageModal] = useState(false);
	const [editUploadImageModal, setEditUploadImageModal] = useState(false);
	const [editFavIconModal, setEditFavIconModal] = useState(false);
	const [editThemeColorModal, setEditThemeColorModal] = useState(false);
	const [editEmailHeaderModal, setEditEmailHeaderModal] = useState(false);
	const [editEmailFooterModal, setEditEmailFooterModal] = useState(false);

	let theme_color = company_data && company_data.theme_color;
	if (theme_color) {
		theme_color = theme_color.split(",");
	}

	useEffect(() => {
		getList();
	}, [getList]);

	// Open & Close  form for edit State
	const openEditCompanyProfileModal = () => {
		setEditCompanyProfileModal(true);
	};
	const closeEditCompanyProfile = () => setEditCompanyProfileModal(false);

	// Open & Close  form for edit Preferences
	const openEditPreferencesModal = () => {
		setEditPreferencesModal(true);
	};
	const closeEditPreferences = () => setEditPreferencesModal(false);

	// Open & Close  form for edit State
	const openEditLogoImageModal = () => {
		setEditLogoImageModal(true);
	};
	const closeEditLogoImage = () => setEditLogoImageModal(false);

	// Open & Close  form for edit State
	const openEditUploadImageModal = () => {
		setEditUploadImageModal(true);
	};
	const closeEditUploadImage = () => setEditUploadImageModal(false);

	// Open & Close  form for edit State
	const openEditFavIconModal = () => {
		setEditFavIconModal(true);
	};
	const closeEditFavIcon = () => setEditFavIconModal(false);

	// Open & Close  form for edit State
	const openEditThemeColorModal = () => {
		setEditThemeColorModal(true);
	};
	const closeEditThemeColor = () => setEditThemeColorModal(false);

	// Open & Close  form for edit State
	const openEditEmailHeaderModal = () => {
		setEditEmailHeaderModal(true);
	};
	const closeEditEmailHeader = () => setEditEmailHeaderModal(false);

	// Open & Close  form for edit State
	const openEditEmailFooterModal = () => {
		setEditEmailFooterModal(true);
	};
	const closeEditEmailFooter = () => setEditEmailFooterModal(false);


	if (!company_data) {
		return (
			<div className="fullscreen__spinner">
				<Spin size="large" />
			</div>
		);
	} else {
		return (
			<>
				<PageHeader
					title={BreadcrumbConfig.CompanySettings.title}
					className="companyAreaSec"
					extra={
						<BreadcrumbComponent
							items={BreadcrumbConfig.CompanySettings.path}
						/>
					}
				>
					<EditPreferencesComponent
						visible={editPreferencesModal}
						close={closeEditPreferences}
					/>
					<EditCompanyProfileComponent
						visible={editCompanyProfileModal}
						close={closeEditCompanyProfile}
					/>
					<EditLogoImageComponent
						visible={editLogoImageModal}
						close={closeEditLogoImage}
					/>
					<EditHeroImageComponent
						visible={editUploadImageModal}
						close={closeEditUploadImage}
					/>
					<EditFavIconComponent
						visible={editFavIconModal}
						close={closeEditFavIcon}
					/>
					<EditThemeColorComponent
						visible={editThemeColorModal}
						close={closeEditThemeColor}
					/>
					<EditEmailHeaderComponent
						visible={editEmailHeaderModal}
						close={closeEditEmailHeader}
					/>
					<EditEmailFooterComponent
						visible={editEmailFooterModal}
						close={closeEditEmailFooter}
					/>

					<div className="companySettingSec">
						<div className="companySettingLeft">
							{/* Profile Section */}
							<div className="companyProfileSec companySettingBlocks">
								<div className="settingHead">
									<h3>Profile</h3>
									{AUTH.checkPrivileges("#22#") && (
										<Tooltip placement="topRight" title={"Edit"}>
											<Button
												type="text"
												className="editIcon"
												size="large"
												style={{ padding: 7 }}
												onClick={() => {
													openEditCompanyProfileModal();
												}}
											>
												<FontAwesomeIcon icon={faPencilAlt} />
											</Button>
										</Tooltip>
									)}
								</div>
								<div className="settingContent">
									<div className="comLogoAddr">
										<div className="profileLogo">
											<img src={company_data && company_data.profile.logo} alt="Company Logo" />
											<Tooltip placement="topRight" title={"Edit"}>
												<Button
													type="text"
													className="editIcon"
													size="large"
													style={{ padding: 7 }}
													onClick={() => {
														openEditLogoImageModal();
													}}
												>
													<FontAwesomeIcon icon={faPencilAlt} />
												</Button>
											</Tooltip>
										</div>
										<div className="profileAddress">
											<h3>{company_data && company_data.profile.name}</h3>
											<div className="addressText">
												<div className="addressIcon">
													<FontAwesomeIcon icon={faMapMarkerAlt} />
												</div>
												<p>
													{company_data && company_data.profile.address_line1},
													{" "}{company_data && company_data.profile.address_line2},
													{" "}{company_data && company_data.profile.city},
													{" "}{company_data && company_data.profile.state}
													{" "}{company_data && company_data.profile.zipcode}
												</p>
											</div>
										</div>
									</div>
									<div className="contactPerson">
										<h3>Contact Person</h3>
										<div className="contactPersonInner">
											<div className="personBlock">
												<div className="personBlockInner">
													<div className="personIcon">
														<FontAwesomeIcon icon={faUser} />
													</div>
													<p title={company_data &&
														company_data.profile.contact_person}>
														{company_data &&
															company_data.profile.contact_person}
													</p>
													<p title={company_data && company_data.profile.designation}>
														{company_data && company_data.profile.designation}
													</p>
												</div>
											</div>
											<div className="personBlock">
												<div className="personBlockInner">
													<div className="personIcon">
														<FontAwesomeIcon icon={faPhoneAlt} />
													</div>
													<p title={company_data &&
														company_data.profile.primary_number}>
														{company_data &&
															company_data.profile.primary_number}
													</p>
													<p title={company_data &&
														company_data.profile.alternate_number}>
														{company_data &&
															company_data.profile.alternate_number}
													</p>
												</div>
											</div>
											<div className="personBlock">
												<div className="personBlockInner">
													<div className="personIcon">
														<FontAwesomeIcon icon={faEnvelope} />
													</div>
													<p title={company_data && company_data.profile.email}>
														{company_data && company_data.profile.email}
													</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							{/* Hero Image Section */}
							<div className="companySettingBlocks">
								<div className="settingHead">
									<h3>Hero Image</h3>
									<Tooltip placement="topRight" title={"Edit"}>
										<Button
											type="text"
											className="editIcon"
											size="large"
											style={{ padding: 7 }}
											onClick={() => {
												openEditUploadImageModal();
											}}
										>
											<FontAwesomeIcon icon={faPencilAlt} />
										</Button>
									</Tooltip>
								</div>
								<div className="settingContent">
									<div className="heroImage">
										<img src={company_data && company_data.hero_image} alt="Company hero" />
									</div>
								</div>
							</div>
							{/* Fav Icon and Theme Color Section */}
							<div className="twoSettingBlocks">
								<div className="companyFavIcon companySettingBlocks">
									<div className="settingHead">
										<h3>Fav Icon</h3>
										<Tooltip placement="topRight" title={"Edit"}>
											<Button
												type="text"
												className="editIcon"
												size="large"
												style={{ padding: 7 }}
												onClick={() => {
													openEditFavIconModal();
												}}
											>
												<FontAwesomeIcon icon={faPencilAlt} />
											</Button>
										</Tooltip>
									</div>
									<div className="settingContent">
										<div className="heroImage">
											<img src={company_data && company_data.favicon} alt="Company favicon" />
										</div>
									</div>
								</div>
								<div className="companyThemeColor companySettingBlocks">
									<div className="settingHead">
										<h3>Theme Color</h3>
										<Tooltip placement="topRight" title={"Edit"}>
											<Button
												type="text"
												className="editIcon"
												size="large"
												style={{ padding: 7 }}
												onClick={() => {
													openEditThemeColorModal();
												}}
											>
												<FontAwesomeIcon icon={faPencilAlt} />
											</Button>
										</Tooltip>
									</div>
									<div className="settingContent">
										<div
											className="themeColor"
											style={
												company_data && {
													backgroundColor: `rgba(${company_data.theme_color}, 1)`,
												}
											}
										></div>
										<div className="themeRGBValue">
											{theme_color && (
												<div className="themeRGMValueInner">
													<div>
														R{" "}
														<div className="themeRGMValueVal">
															{theme_color[0].trim()}
														</div>
													</div>
													<div>
														G{" "}
														<div className="themeRGMValueVal">
															{theme_color[1].trim()}
														</div>
													</div>
													<div>
														B{" "}
														<div className="themeRGMValueVal">
															{theme_color[2].trim()}
														</div>
													</div>
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
							{/* Email Header Section */}
							<div className="companySettingBlocks">
								<div className="settingHead">
									<h3>Email Header</h3>
									<Tooltip placement="topRight" title={"Edit"}>
										<Button
											type="text"
											className="editIcon"
											size="large"
											style={{ padding: 7 }}
											onClick={() => {
												openEditEmailHeaderModal();
											}}
										>
											<FontAwesomeIcon icon={faPencilAlt} />
										</Button>
									</Tooltip>
								</div>
								<div className="settingContent">
									<div className="heroImage">
										<img src={company_data && company_data.email_banner} alt="Company email banner" />
									</div>
								</div>
							</div>
							{/* Email Footer Section */}
							<div className="companySettingBlocks">
								<div className="settingHead">
									<h3>Email Footer</h3>
									<Tooltip placement="topRight" title={"Edit"}>
										<Button
											type="text"
											className="editIcon"
											size="large"
											style={{ padding: 7 }}
											onClick={() => {
												openEditEmailFooterModal();
											}}
										>
											<FontAwesomeIcon icon={faPencilAlt} />
										</Button>
									</Tooltip>
								</div>
								<div className="settingContent">
									<div
										dangerouslySetInnerHTML={{
											__html: company_data.email_footer,
										}}
									/>
								</div>
							</div>
						</div>
						<div className="companySettingRight">
							{/* Preferences Section */}
							<div className="companySettingBlocks">
								<div className="settingHead">
									<h3>Preferences</h3>
									{AUTH.checkPrivileges("#23#") && (
										<Tooltip placement="topRight" title={"Edit"}>
											<Button
												type="text"
												className="editIcon"
												size="large"
												style={{ padding: 7 }}
												onClick={() => {
													openEditPreferencesModal();
												}}
											>
												<FontAwesomeIcon icon={faPencilAlt} />
											</Button>
										</Tooltip>
									)}
								</div>
								<div className="preferencesSec">
									<div className="preferencesBlock">
										<ul className="preferencesList">
											<li>
												<p>Brand</p>
												<div className="preferenceRight">
													<span>
														{company_data && company_data.preferences.brand.name}
													</span>
													<Tooltip title={"Default Brand"}>
														<div className="infoWrap"><InfoIcon className="infoIcon" /></div>
													</Tooltip>
												</div>
											</li>
											<li>
												<p>AS3 Bucket</p>
												<div className="preferenceRight">
													<span>
														{company_data && company_data.preferences.as3_bucket}
													</span>
													<Tooltip title={"External file storage service"}>
														<div className="infoWrap"><InfoIcon className="infoIcon" /></div>
													</Tooltip>
												</div>
											</li>
											<li>
												<p>Session Timeout</p>
												<div className="preferenceRight">
													<span>
														{`${company_data && company_data.preferences.session_timeout} Hours`}
													</span>
													<Tooltip title={"The user session expires automatically after specified hours"}>
														<div className="infoWrap"><InfoIcon className="infoIcon" /></div>
													</Tooltip>
												</div>
											</li>
										</ul>
									</div>

									<div className="preferencesBlock">
										<h5>Inquiry</h5>
										<ul className="preferencesList">
											<li>
												<p>Age</p>
												<div className="preferenceRight">
													<span>
														{`${company_data && company_data.preferences.inquire_closure_days} Days`}
													</span>
													<Tooltip title={"An inquiry is considered to be closed automatically after specified days"}>
														<div className="infoWrap"><InfoIcon className="infoIcon" /></div>
													</Tooltip>
												</div>
											</li>
										</ul>
									</div>

									<div className="preferencesBlock">
										<h5>Booking & Sales</h5>
										<ul className="preferencesList">
											<li>
												<p>Mfg. Charge Per Day</p>
												<div className="preferenceRight">
													<span>
														{`${company_data && company_data.preferences.mfg_cpd} %`}
													</span>
													<Tooltip title={"Per day charge by MFG on stock you hold"}>
														<div className="infoWrap"><InfoIcon className="infoIcon" /></div>
													</Tooltip>
												</div>
											</li>
											<li>
												<p>Cash Limit</p>
												<div className="preferenceRight">
													<span>
														INR {company_data && CurrencyFormat({ value: company_data.preferences.cash_limit })}
													</span>
													<Tooltip title={"Cannot accept cash more than specified per booking"}>
														<div className="infoWrap"><InfoIcon className="infoIcon" /></div>
													</Tooltip>
												</div>
											</li>
											<li>
												<p>CRTM</p>
												<div className="preferenceRight">
													<span>
														INR {company_data && CurrencyFormat({ value: company_data.preferences.crtm })}
													</span>
													<Tooltip title={"CRTM charge on RTO"}>
														<div className="infoWrap"><InfoIcon className="infoIcon" /></div>
													</Tooltip>
												</div>
											</li>
											<li>
												<p>Fastag</p>
												<div className="preferenceRight">
													<span>
														INR {company_data && CurrencyFormat({ value: company_data.preferences.fastag })}
													</span>
													<Tooltip title={"Fastag Charge"}>
														<div className="infoWrap"><InfoIcon className="infoIcon" /></div>
													</Tooltip>
												</div>
											</li>
											<li>
												<p>TCS</p>
												<div className="preferenceRight">
													<span>
														{company_data && company_data.preferences.tcs} %
													</span>
													<Tooltip title={"Tax Collection @ Source on booking"}>
														<div className="infoWrap"><InfoIcon className="infoIcon" /></div>
													</Tooltip>
												</div>
											</li>
											<li>
												<p>Accessory Discount</p>
												<div className="preferenceRight">
													<span>
														{company_data && company_data.preferences.max_acc_disc} %
													</span>
													<Tooltip title={"Maximum percentage discount on accessories that doesn't require approval"}>
														<div className="infoWrap"><InfoIcon className="infoIcon" /></div>
													</Tooltip>
												</div>
											</li>
											<li>
												<p>Cancellation Charge</p>
												<div className="preferenceRight">
													<span>
														{company_data && company_data.preferences.cancellation_chrg_per} %
													</span>
													<Tooltip title={"Charge applicable on booking cancellation"}>
														<div className="infoWrap"><InfoIcon className="infoIcon" /></div>
													</Tooltip>
												</div>
											</li>
											<li>
												<p>Max. Cancellation Charge</p>
												<div className="preferenceRight">
													<span>
														INR {company_data && CurrencyFormat({ value: company_data.preferences.max_cancellation_chrg })}
													</span>
													<Tooltip title={"Maximum cancellation charge"}>
														<div className="infoWrap"><InfoIcon className="infoIcon" /></div>
													</Tooltip>
												</div>
											</li>
										</ul>
									</div>

									<div className="preferencesBlock">
										<h5>Finance</h5>
										<ul className="preferencesList">
											<li>
												<p>TDS on Income</p>
												<div className="preferenceRight">
													<span>
														{company_data && company_data.preferences.fin_tds} %
													</span>
													<Tooltip title={"TDS charge to be paid on finance income (calculated for each quotation)"}>
														<div className="infoWrap"><InfoIcon className="infoIcon" /></div>
													</Tooltip>
												</div>
											</li>
											<li>
												<p>ST on Income</p>
												<div className="preferenceRight">
													<span>
														{company_data && company_data.preferences.fin_st} %
													</span>
													<Tooltip title={"Service Tax charge to be paid on finance income (calculated for each quotation)"}>
														<div className="infoWrap"><InfoIcon className="infoIcon" /></div>
													</Tooltip>
												</div>
											</li>
										</ul>
									</div>

									<div className="preferencesBlock">
										<h5>Insurance</h5>
										<ul className="preferencesList">
											<li>
												<p>Acc. Rates</p>
												<div className="preferenceRight">
													<span>
														{company_data && company_data.preferences.ins_acc_rate} %
													</span>
													<Tooltip title={"Percentage charge on Electrical & Non-Electrical Accessories IDVs"}>
														<div className="infoWrap"><InfoIcon className="infoIcon" /></div>
													</Tooltip>
												</div>
											</li>
											<li>
												<p>CNG Rate (third party)</p>
												<div className="preferenceRight">
													<span>
														INR {company_data && CurrencyFormat({ value: company_data.preferences.ins_tp_cng_rate })}
													</span>
													<Tooltip title={"Thirdparty Insurance, CNG Rate"}>
														<div className="infoWrap"><InfoIcon className="infoIcon" /></div>
													</Tooltip>
												</div>
											</li>
											<li>
												<p>LL Rate</p>
												<div className="preferenceRight">
													<span>
														INR {company_data && CurrencyFormat({ value: company_data.preferences.ins_ll_rate })}
													</span>
													<Tooltip title={"Fixed Legal Liability Rate"}>
														<div className="infoWrap"><InfoIcon className="infoIcon" /></div>
													</Tooltip>
												</div>
											</li>
										</ul>
									</div>


								</div>
							</div>
						</div>
					</div>
				</PageHeader>
			</>
		);
	}
});

export default CompanySettings;
