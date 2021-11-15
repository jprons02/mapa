import React from "react";
import { Button, Segment, Form, Loader, Header } from "semantic-ui-react";

class GaViewReport extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedProperty: "miccosukee",
      selectedReport: "weekOverWeek",
      isIframeLoading: true,
    };
  }

  gaProperties = () => {
    return [
      { key: "miccosukee", value: "miccosukee", text: "Miccosukee" },
      { key: "mrg", value: "mrg", text: "Resort & Gaming" },
      { key: "golf", value: "golf", text: "Golf & Country Club" },
      { key: "village", value: "village", text: "Indian Village" },
      { key: "airboat", value: "airboat", text: "Airboat Rides" },
      { key: "history", value: "history", text: "History" },
      {
        key: "administration",
        value: "administration",
        text: "Administration",
      },
    ];
  };

  gaReport = () => {
    return [
      { key: "weekOverWeek", value: "weekOverWeek", text: "Week over Week" },
      {
        key: "monthOverMonth",
        value: "monthOverMonth",
        text: "Month over Month",
      },
      { key: "yearOverYear", value: "yearOverYear", text: "Year over Year" },
      {
        key: "sessionsByDevice",
        value: "sessionsByDevice",
        text: "Sessions by Device",
      },
      {
        key: "referringSocialSources",
        value: "referringSocialSources",
        text: "Referring Social Sources",
      },
      {
        key: "referringDomains",
        value: "referringDomains",
        text: "Referring Domains",
      },
    ];
  };

  onPropertyChange = (e, value) => {
    this.setState({
      selectedProperty: value,
      isIframeLoading: true,
    });
  };

  onReportChange = (e, value) => {
    this.setState({
      selectedReport: value,
      isIframeLoading: true,
    });
  };

  hideSpinner = () => {
    this.setState({
      isIframeLoading: false,
    });
  };

  reports = () => {
    return {
      miccosukee: {
        weekOverWeek: (
          <iframe
            onLoad={this.hideSpinner}
            title="week"
            width="600"
            height="371"
            seamless
            frameBorder="0"
            scrolling="no"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRe5NJUU0qZ0-v50KkZZp-vsy74RYXLgn2T8djn6X_7JPetruZVqBD89NWbrBaj5wkOTX9urO0tA_tz/pubchart?oid=2022801120&amp;format=interactive"
          ></iframe>
        ),
        monthOverMonth: (
          <iframe
            onLoad={this.hideSpinner}
            title="month"
            width="600"
            height="371"
            seamless
            frameBorder="0"
            scrolling="no"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTpyyBKGz13GRs3oJDYRvG0FUdenErq_vo7aDFEM4Yp3cqD1p1ks90lU7bXngM7JJ_tQCkzdNs8aP8E/pubchart?oid=142712074&amp;format=interactive"
          ></iframe>
        ),
        yearOverYear: (
          <iframe
            onLoad={this.hideSpinner}
            title="year"
            width="600"
            height="371"
            seamless
            frameBorder="0"
            scrolling="no"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSxK33Qewe-R7C4YGvPVDEL-MY6emJ1RbtiOS_We5WJDlUGgigUEAxDfsihzxjMUXtiZ9cljqkDujKx/pubchart?oid=437205722&amp;format=interactive"
          ></iframe>
        ),
        sessionsByDevice: (
          <iframe
            onLoad={this.hideSpinner}
            title="device"
            width="600"
            height="371"
            seamless
            frameBorder="0"
            scrolling="no"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRE_YRDVjpGv0KqTh4ucQg4Ma4MRTRDjptKXe-9hhM93j3_j9SFBCjpPPFNvEo3DqS5EPsq1gkgCm6N/pubchart?oid=355520724&amp;format=interactive"
          ></iframe>
        ),
        referringSocialSources: (
          <iframe
            onLoad={this.hideSpinner}
            title="socialRef"
            width="600"
            height="371"
            seamless
            frameBorder="0"
            scrolling="no"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vQbqsX2KzLGz7lrZZpbLMO9yvzzH8YUdX5qT9UjlntJjN5qGzTLp3uQL5DbJ2B7ijj8suRGS3nuKtqC/pubchart?oid=1956140218&amp;format=interactive"
          ></iframe>
        ),
        referringDomains: (
          <iframe
            onLoad={this.hideSpinner}
            title="domainRef"
            width="600"
            height="371"
            seamless
            frameBorder="0"
            scrolling="no"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSQzqBlYwZiGz0MBu0kuY49gF-rm6KujoC6NoVtaSQJfph_n5vZfAcc0EvWIPZj1DhZc4y9bjEl3fKg/pubchart?oid=1093518090&amp;format=interactive"
          ></iframe>
        ),
      },
      mrg: {
        weekOverWeek: (
          <iframe
            onLoad={this.hideSpinner}
            title="week"
            width="600"
            height="371"
            seamless
            frameBorder="0"
            scrolling="no"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRe5NJUU0qZ0-v50KkZZp-vsy74RYXLgn2T8djn6X_7JPetruZVqBD89NWbrBaj5wkOTX9urO0tA_tz/pubchart?oid=750290000&amp;format=interactive"
          ></iframe>
        ),
        monthOverMonth: (
          <iframe
            onLoad={this.hideSpinner}
            title="month"
            width="600"
            height="371"
            seamless
            frameBorder="0"
            scrolling="no"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTpyyBKGz13GRs3oJDYRvG0FUdenErq_vo7aDFEM4Yp3cqD1p1ks90lU7bXngM7JJ_tQCkzdNs8aP8E/pubchart?oid=1569299110&amp;format=interactive"
          ></iframe>
        ),
        yearOverYear: (
          <iframe
            onLoad={this.hideSpinner}
            title="year"
            width="600"
            height="371"
            seamless
            frameBorder="0"
            scrolling="no"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSxK33Qewe-R7C4YGvPVDEL-MY6emJ1RbtiOS_We5WJDlUGgigUEAxDfsihzxjMUXtiZ9cljqkDujKx/pubchart?oid=443945057&amp;format=interactive"
          ></iframe>
        ),
        sessionsByDevice: (
          <iframe
            onLoad={this.hideSpinner}
            title="device"
            width="600"
            height="371"
            seamless
            frameBorder="0"
            scrolling="no"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRE_YRDVjpGv0KqTh4ucQg4Ma4MRTRDjptKXe-9hhM93j3_j9SFBCjpPPFNvEo3DqS5EPsq1gkgCm6N/pubchart?oid=761129928&amp;format=interactive"
          ></iframe>
        ),
        referringSocialSources: (
          <iframe
            onLoad={this.hideSpinner}
            title="socialRef"
            width="1000"
            height="371"
            seamless
            frameBorder="0"
            scrolling="no"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vQbqsX2KzLGz7lrZZpbLMO9yvzzH8YUdX5qT9UjlntJjN5qGzTLp3uQL5DbJ2B7ijj8suRGS3nuKtqC/pubchart?oid=1415950778&amp;format=interactive"
          ></iframe>
        ),
        referringDomains: (
          <iframe
            onLoad={this.hideSpinner}
            title="domainRef"
            width="600"
            height="371"
            seamless
            frameBorder="0"
            scrolling="no"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSQzqBlYwZiGz0MBu0kuY49gF-rm6KujoC6NoVtaSQJfph_n5vZfAcc0EvWIPZj1DhZc4y9bjEl3fKg/pubchart?oid=2039521615&amp;format=interactive"
          ></iframe>
        ),
      },
      golf: {
        weekOverWeek: (
          <iframe
            onLoad={this.hideSpinner}
            title="week"
            width="600"
            height="371"
            seamless
            frameBorder="0"
            scrolling="no"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRe5NJUU0qZ0-v50KkZZp-vsy74RYXLgn2T8djn6X_7JPetruZVqBD89NWbrBaj5wkOTX9urO0tA_tz/pubchart?oid=1102172447&amp;format=interactive"
          ></iframe>
        ),
        monthOverMonth: (
          <iframe
            onLoad={this.hideSpinner}
            title="month"
            width="600"
            height="371"
            seamless
            frameBorder="0"
            scrolling="no"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTpyyBKGz13GRs3oJDYRvG0FUdenErq_vo7aDFEM4Yp3cqD1p1ks90lU7bXngM7JJ_tQCkzdNs8aP8E/pubchart?oid=1756783577&amp;format=interactive"
          ></iframe>
        ),
        yearOverYear: (
          <iframe
            onLoad={this.hideSpinner}
            title="year"
            width="600"
            height="371"
            seamless
            frameBorder="0"
            scrolling="no"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSxK33Qewe-R7C4YGvPVDEL-MY6emJ1RbtiOS_We5WJDlUGgigUEAxDfsihzxjMUXtiZ9cljqkDujKx/pubchart?oid=1857282078&amp;format=interactive"
          ></iframe>
        ),
        sessionsByDevice: (
          <iframe
            onLoad={this.hideSpinner}
            title="device"
            width="600"
            height="371"
            seamless
            frameBorder="0"
            scrolling="no"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRE_YRDVjpGv0KqTh4ucQg4Ma4MRTRDjptKXe-9hhM93j3_j9SFBCjpPPFNvEo3DqS5EPsq1gkgCm6N/pubchart?oid=1502226562&amp;format=interactive"
          ></iframe>
        ),
        referringSocialSources: (
          <iframe
            onLoad={this.hideSpinner}
            title="socialRef"
            width="600"
            height="371"
            seamless
            frameBorder="0"
            scrolling="no"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vQbqsX2KzLGz7lrZZpbLMO9yvzzH8YUdX5qT9UjlntJjN5qGzTLp3uQL5DbJ2B7ijj8suRGS3nuKtqC/pubchart?oid=1653877705&amp;format=interactive"
          ></iframe>
        ),
        referringDomains: (
          <iframe
            onLoad={this.hideSpinner}
            title="domainRef"
            width="600"
            height="371"
            seamless
            frameBorder="0"
            scrolling="no"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSQzqBlYwZiGz0MBu0kuY49gF-rm6KujoC6NoVtaSQJfph_n5vZfAcc0EvWIPZj1DhZc4y9bjEl3fKg/pubchart?oid=362181102&amp;format=interactive"
          ></iframe>
        ),
      },
      village: {
        weekOverWeek: (
          <iframe
            onLoad={this.hideSpinner}
            title="week"
            width="600"
            height="371"
            seamless
            frameBorder="0"
            scrolling="no"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRe5NJUU0qZ0-v50KkZZp-vsy74RYXLgn2T8djn6X_7JPetruZVqBD89NWbrBaj5wkOTX9urO0tA_tz/pubchart?oid=1838973817&amp;format=interactive"
          ></iframe>
        ),
        monthOverMonth: (
          <iframe
            onLoad={this.hideSpinner}
            title="month"
            width="600"
            height="371"
            seamless
            frameBorder="0"
            scrolling="no"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTpyyBKGz13GRs3oJDYRvG0FUdenErq_vo7aDFEM4Yp3cqD1p1ks90lU7bXngM7JJ_tQCkzdNs8aP8E/pubchart?oid=1916134708&amp;format=interactive"
          ></iframe>
        ),
        yearOverYear: (
          <iframe
            onLoad={this.hideSpinner}
            title="year"
            width="600"
            height="371"
            seamless
            frameBorder="0"
            scrolling="no"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSxK33Qewe-R7C4YGvPVDEL-MY6emJ1RbtiOS_We5WJDlUGgigUEAxDfsihzxjMUXtiZ9cljqkDujKx/pubchart?oid=1353355555&amp;format=interactive"
          ></iframe>
        ),
        sessionsByDevice: (
          <iframe
            onLoad={this.hideSpinner}
            title="device"
            width="600"
            height="371"
            seamless
            frameBorder="0"
            scrolling="no"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRE_YRDVjpGv0KqTh4ucQg4Ma4MRTRDjptKXe-9hhM93j3_j9SFBCjpPPFNvEo3DqS5EPsq1gkgCm6N/pubchart?oid=1211318700&amp;format=interactive"
          ></iframe>
        ),
        referringSocialSources: (
          <iframe
            onLoad={this.hideSpinner}
            title="socialRef"
            width="600"
            height="371"
            seamless
            frameBorder="0"
            scrolling="no"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vQbqsX2KzLGz7lrZZpbLMO9yvzzH8YUdX5qT9UjlntJjN5qGzTLp3uQL5DbJ2B7ijj8suRGS3nuKtqC/pubchart?oid=1543015452&amp;format=interactive"
          ></iframe>
        ),
        referringDomains: (
          <iframe
            onLoad={this.hideSpinner}
            title="domainRef"
            width="600"
            height="371"
            seamless
            frameBorder="0"
            scrolling="no"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSQzqBlYwZiGz0MBu0kuY49gF-rm6KujoC6NoVtaSQJfph_n5vZfAcc0EvWIPZj1DhZc4y9bjEl3fKg/pubchart?oid=682325397&amp;format=interactive"
          ></iframe>
        ),
      },
      airboat: {
        weekOverWeek: (
          <iframe
            onLoad={this.hideSpinner}
            title="week"
            width="600"
            height="371"
            seamless
            frameBorder="0"
            scrolling="no"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRe5NJUU0qZ0-v50KkZZp-vsy74RYXLgn2T8djn6X_7JPetruZVqBD89NWbrBaj5wkOTX9urO0tA_tz/pubchart?oid=93968544&amp;format=interactive"
          ></iframe>
        ),
        monthOverMonth: (
          <iframe
            onLoad={this.hideSpinner}
            title="month"
            width="600"
            height="371"
            seamless
            frameBorder="0"
            scrolling="no"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTpyyBKGz13GRs3oJDYRvG0FUdenErq_vo7aDFEM4Yp3cqD1p1ks90lU7bXngM7JJ_tQCkzdNs8aP8E/pubchart?oid=1078051355&amp;format=interactive"
          ></iframe>
        ),
        yearOverYear: (
          <iframe
            onLoad={this.hideSpinner}
            title="year"
            width="600"
            height="371"
            seamless
            frameBorder="0"
            scrolling="no"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSxK33Qewe-R7C4YGvPVDEL-MY6emJ1RbtiOS_We5WJDlUGgigUEAxDfsihzxjMUXtiZ9cljqkDujKx/pubchart?oid=6992960&amp;format=interactive"
          ></iframe>
        ),
        sessionsByDevice: (
          <iframe
            onLoad={this.hideSpinner}
            title="device"
            width="600"
            height="371"
            seamless
            frameBorder="0"
            scrolling="no"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRE_YRDVjpGv0KqTh4ucQg4Ma4MRTRDjptKXe-9hhM93j3_j9SFBCjpPPFNvEo3DqS5EPsq1gkgCm6N/pubchart?oid=1263632158&amp;format=interactive"
          ></iframe>
        ),
        referringSocialSources: (
          <iframe
            onLoad={this.hideSpinner}
            title="socialRef"
            width="600"
            height="371"
            seamless
            frameBorder="0"
            scrolling="no"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vQbqsX2KzLGz7lrZZpbLMO9yvzzH8YUdX5qT9UjlntJjN5qGzTLp3uQL5DbJ2B7ijj8suRGS3nuKtqC/pubchart?oid=503003507&amp;format=interactive"
          ></iframe>
        ),
        referringDomains: (
          <iframe
            onLoad={this.hideSpinner}
            title="domainRef"
            width="600"
            height="371"
            seamless
            frameBorder="0"
            scrolling="no"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSQzqBlYwZiGz0MBu0kuY49gF-rm6KujoC6NoVtaSQJfph_n5vZfAcc0EvWIPZj1DhZc4y9bjEl3fKg/pubchart?oid=1932316522&amp;format=interactive"
          ></iframe>
        ),
      },
      history: {
        weekOverWeek: (
          <iframe
            onLoad={this.hideSpinner}
            title="week"
            width="600"
            height="371"
            seamless
            frameBorder="0"
            scrolling="no"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRe5NJUU0qZ0-v50KkZZp-vsy74RYXLgn2T8djn6X_7JPetruZVqBD89NWbrBaj5wkOTX9urO0tA_tz/pubchart?oid=1311125774&amp;format=interactive"
          ></iframe>
        ),
        monthOverMonth: (
          <iframe
            onLoad={this.hideSpinner}
            title="month"
            width="600"
            height="371"
            seamless
            frameBorder="0"
            scrolling="no"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTpyyBKGz13GRs3oJDYRvG0FUdenErq_vo7aDFEM4Yp3cqD1p1ks90lU7bXngM7JJ_tQCkzdNs8aP8E/pubchart?oid=857874866&amp;format=interactive"
          ></iframe>
        ),
        yearOverYear: (
          <iframe
            onLoad={this.hideSpinner}
            title="year"
            width="600"
            height="371"
            seamless
            frameBorder="0"
            scrolling="no"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSxK33Qewe-R7C4YGvPVDEL-MY6emJ1RbtiOS_We5WJDlUGgigUEAxDfsihzxjMUXtiZ9cljqkDujKx/pubchart?oid=1711265888&amp;format=interactive"
          ></iframe>
        ),
        sessionsByDevice: (
          <iframe
            onLoad={this.hideSpinner}
            title="device"
            width="600"
            height="371"
            seamless
            frameBorder="0"
            scrolling="no"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRE_YRDVjpGv0KqTh4ucQg4Ma4MRTRDjptKXe-9hhM93j3_j9SFBCjpPPFNvEo3DqS5EPsq1gkgCm6N/pubchart?oid=1982780738&amp;format=interactive"
          ></iframe>
        ),
        referringSocialSources: (
          <iframe
            onLoad={this.hideSpinner}
            title="socialRef"
            width="600"
            height="371"
            seamless
            frameBorder="0"
            scrolling="no"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vQbqsX2KzLGz7lrZZpbLMO9yvzzH8YUdX5qT9UjlntJjN5qGzTLp3uQL5DbJ2B7ijj8suRGS3nuKtqC/pubchart?oid=256565056&amp;format=interactive"
          ></iframe>
        ),
        referringDomains: (
          <iframe
            onLoad={this.hideSpinner}
            title="domainRef"
            width="600"
            height="371"
            seamless
            frameBorder="0"
            scrolling="no"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSQzqBlYwZiGz0MBu0kuY49gF-rm6KujoC6NoVtaSQJfph_n5vZfAcc0EvWIPZj1DhZc4y9bjEl3fKg/pubchart?oid=393973727&amp;format=interactive"
          ></iframe>
        ),
      },
      administration: {
        weekOverWeek: (
          <iframe
            onLoad={this.hideSpinner}
            title="week"
            width="600"
            height="371"
            seamless
            frameBorder="0"
            scrolling="no"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRe5NJUU0qZ0-v50KkZZp-vsy74RYXLgn2T8djn6X_7JPetruZVqBD89NWbrBaj5wkOTX9urO0tA_tz/pubchart?oid=1746186692&amp;format=interactive"
          ></iframe>
        ),
        monthOverMonth: (
          <iframe
            onLoad={this.hideSpinner}
            title="month"
            width="600"
            height="371"
            seamless
            frameBorder="0"
            scrolling="no"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTpyyBKGz13GRs3oJDYRvG0FUdenErq_vo7aDFEM4Yp3cqD1p1ks90lU7bXngM7JJ_tQCkzdNs8aP8E/pubchart?oid=663127956&amp;format=interactive"
          ></iframe>
        ),
        yearOverYear: (
          <iframe
            onLoad={this.hideSpinner}
            title="year"
            width="600"
            height="371"
            seamless
            frameBorder="0"
            scrolling="no"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSxK33Qewe-R7C4YGvPVDEL-MY6emJ1RbtiOS_We5WJDlUGgigUEAxDfsihzxjMUXtiZ9cljqkDujKx/pubchart?oid=1939764702&amp;format=interactive"
          ></iframe>
        ),
        sessionsByDevice: (
          <iframe
            onLoad={this.hideSpinner}
            title="device"
            width="600"
            height="371"
            seamless
            frameBorder="0"
            scrolling="no"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRE_YRDVjpGv0KqTh4ucQg4Ma4MRTRDjptKXe-9hhM93j3_j9SFBCjpPPFNvEo3DqS5EPsq1gkgCm6N/pubchart?oid=210968423&amp;format=interactive"
          ></iframe>
        ),
        referringSocialSources: (
          <iframe
            onLoad={this.hideSpinner}
            title="socialRef"
            width="600"
            height="371"
            seamless
            frameBorder="0"
            scrolling="no"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vQbqsX2KzLGz7lrZZpbLMO9yvzzH8YUdX5qT9UjlntJjN5qGzTLp3uQL5DbJ2B7ijj8suRGS3nuKtqC/pubchart?oid=2022847&amp;format=interactive"
          ></iframe>
        ),
        referringDomains: (
          <iframe
            onLoad={this.hideSpinner}
            title="domainRef"
            width="600"
            height="371"
            seamless
            frameBorder="0"
            scrolling="no"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSQzqBlYwZiGz0MBu0kuY49gF-rm6KujoC6NoVtaSQJfph_n5vZfAcc0EvWIPZj1DhZc4y9bjEl3fKg/pubchart?oid=318542110&amp;format=interactive"
          ></iframe>
        ),
      },
    };
  };

  renderReport = () => {
    if (
      (this.state.selectedProperty !== "") &
      (this.state.selectedReport !== "")
    ) {
      const selectedIframe =
        this.reports()[this.state.selectedProperty][this.state.selectedReport];
      return <div style={{ marginTop: "20px" }}>{selectedIframe}</div>;
    } else {
      return "";
    }
  };

  render() {
    const iframeStyle = this.state.isIframeLoading
      ? { visibility: "hidden" }
      : { visibility: "visible" };
    const selectedIframe =
      this.reports()[this.state.selectedProperty][this.state.selectedReport];

    return (
      <React.Fragment>
        <Button
          onClick={() => this.props.history.push("/")}
          labelPosition="left"
          icon="left chevron"
          content="Back"
        />
        <Segment style={{ padding: "20px 14px 40px 14px" }} raised>
          <Header as="h2">Website Analytics</Header>
          <Form>
            <Form.Group>
              <Form.Select
                onChange={(e, { value }) => this.onPropertyChange(e, value)}
                value={this.state.selectedProperty}
                placeholder="Select Property"
                options={this.gaProperties()}
              />
              <Form.Select
                onChange={(e, { value }) => this.onReportChange(e, value)}
                value={this.state.selectedReport}
                placeholder="Select Report"
                options={this.gaReport()}
              />
            </Form.Group>
          </Form>
          <div>
            <Loader active={this.state.isIframeLoading} />
            <div style={iframeStyle}>{selectedIframe}</div>
          </div>
        </Segment>
      </React.Fragment>
    );
  }
}

export default GaViewReport;
