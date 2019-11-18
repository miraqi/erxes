import apolloClient from 'apolloClient';
import gql from 'graphql-tag';
import Alert from 'modules/common/utils/Alert';
import * as React from 'react';
import { mutations } from '../graphql';

interface IState {
  activeRoute: string | '';
  selectedJobType?: string;
}

interface IStore extends IState {
  changeRoute: (route: string) => void;
  markAsNotified: (id: string) => void;
  toggleContent: () => void;
  selectJobType: (job: string) => void;
}

const RobotContext = React.createContext({} as IStore);

export const RobotConsumer = RobotContext.Consumer;

export class RobotProvider extends React.Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      activeRoute: 'onboardInitial',
      selectedJobType: ''
    };
  }

  changeRoute = (route: string) => {
    this.setState({ activeRoute: route });
  };

  selectJobType = (jobType: string) => {
    this.setState({ selectedJobType: jobType });
  };

  toggleContent = () => {
    // hide content
    if (this.state.activeRoute.startsWith('assistant')) {
      return this.changeRoute('');
    }

    return this.changeRoute('assistant');
  };

  markNotified = (id: string) => {
    apolloClient
      .mutate({
        mutation: gql(mutations.markAsNotified),
        variables: { _id: id }
      })
      .then(() => {
        Alert.success('Successfully');
      });
  };

  public render() {
    return (
      <RobotContext.Provider
        value={{
          ...this.state,
          changeRoute: this.changeRoute,
          toggleContent: this.toggleContent,
          selectJobType: this.selectJobType,
          markAsNotified: this.markNotified
        }}
      >
        {this.props.children}
      </RobotContext.Provider>
    );
  }
}