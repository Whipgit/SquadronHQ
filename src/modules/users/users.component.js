import React from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { compose, lifecycle } from 'recompose'
import { Table, Checkbox } from 'semantic-ui-react'
import { Dimmer, Loader } from 'semantic-ui-react'
import styled from 'styled-components'

import { fetchUsersData, saveUserPermissions } from './users.reducer'

const Users = ({ users, data, saveUserPermissions }) => {
  return <PilotContainer>
      <Helmet>
        <title>Squadron HQ - Manage Users</title>
      </Helmet>
      {data.cata({ Empty: () => <LoaderComponent />, Data: () => <InnerContainer>
            <Table compact>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Callsign</Table.HeaderCell>
                  <Table.HeaderCell>Email</Table.HeaderCell>
                  <Table.HeaderCell>Trainee</Table.HeaderCell>
                  <Table.HeaderCell>Pilot</Table.HeaderCell>
                  <Table.HeaderCell>LSO</Table.HeaderCell>
                  <Table.HeaderCell>Staff</Table.HeaderCell>
                  <Table.HeaderCell>Admin</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {users ? users.map((user, key) => <Table.Row key={key}>
                        <Table.Cell>
                          {user.callsign}
                          <br />
                          <Uid>{user.uid}</Uid>
                        </Table.Cell>
                        <Table.Cell>{user.email}</Table.Cell>
                        <Table.Cell>
                          <Checkbox checked={user.isTrainee} onChange={() => saveUserPermissions({
                                user,
                                field: 'isTrainee',
                                val: !user.isTrainee,
                              })} />
                        </Table.Cell>
                        <Table.Cell>
                          <Checkbox checked={user.isFullMember} onChange={() => saveUserPermissions({
                                user,
                                field: 'isFullMember',
                                val: !user.isFullMember,
                              })} />
                        </Table.Cell>
                        <Table.Cell>
                          <Checkbox checked={user.isLSO} onChange={() => saveUserPermissions({
                                user,
                                field: 'isLSO',
                                val: !user.isLSO,
                              })} />
                        </Table.Cell>
                        <Table.Cell>
                          <Checkbox checked={user.isStaff} onChange={() => saveUserPermissions({
                                user,
                                field: 'isStaff',
                                val: !user.isStaff,
                              })} />
                        </Table.Cell>
                        <Table.Cell>
                          <Checkbox checked={user.isAdmin} onChange={() => saveUserPermissions({
                                user,
                                field: 'isAdmin',
                                val: !user.isAdmin,
                              })} />
                        </Table.Cell>
                      </Table.Row>) : ''}
              </Table.Body>
            </Table>
          </InnerContainer> })}
    </PilotContainer>
}

const PilotContainer = styled.div``

const InnerContainer = styled.div`
  width: 90%;
  margin: auto;
`

const Uid = styled.p`
  font-size: 10px;
  margin: 0 !important;
  padding: 0 !important;
`

const enhance = compose(
  lifecycle({
    componentDidMount() {
      this.props.fetchUsersData()
    },
  })
)

const enhancedComponent = enhance(Users)

export default connect(state => ({ data: state.users.data, users: state.users.users }), {
  fetchUsersData,
  saveUserPermissions,
})(enhancedComponent)

const LoaderComponent = () => (
  <DimmerContainer>
    <Dimmer active inverted>
      <Loader>Loading Users</Loader>
    </Dimmer>
  </DimmerContainer>
)

const DimmerContainer = styled.div`
  position: fixed; /* Sit on top of the page content */
  width: 100vw; /* Full width (cover the whole page) */
  height: 100vh; /* Full height (cover the whole page) */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-order; 2;
`
