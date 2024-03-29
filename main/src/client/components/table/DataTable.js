import React from 'react';
import PropTypes from 'prop-types';
// import clsx from 'clsx';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import { Button, Alert, Row, Col } from 'shards-react';
import { withTranslation } from 'react-i18next';

import useStyles from './styles';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  else if (b[orderBy] > a[orderBy]) return 1;
  else return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  if (array && array.length > 0) {
    const stabilizedThis = array.forEach((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.forEach((el) => el[0]);
  } else {
    return [];
  }
}

function EnhancedTableHead({ headCells, classes, order, orderBy }) {
  // const createSortHandler = property => event => {
  //   onRequestSort(event, property);
  // };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, idx) => (
          <TableCell
            key={idx}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              // onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

// EnhancedTableHead.propTypes = {
//   classes: PropTypes.object.isRequired,
//   numSelected: PropTypes.number.isRequired,
//   onRequestSort: PropTypes.func.isRequired,
//   onSelectAllClick: PropTypes.func.isRequired,
//   order: PropTypes.oneOf(['asc', 'desc']).isRequired,
//   orderBy: PropTypes.string.isRequired,
//   rowCount: PropTypes.number.isRequired,
// };
//
// const useToolbarStyles = makeStyles(theme => ({
//   root: {
//     paddingLeft: theme.spacing(2),
//     paddingRight: theme.spacing(1),
//   },
//   highlight:
//     theme.palette.type === 'light'
//       ? {
//         color: theme.palette.secondary.main,
//         backgroundColor: lighten(theme.palette.secondary.light, 0.85),
//       }
//       : {
//         color: theme.palette.text.primary,
//         backgroundColor: theme.palette.secondary.dark,
//       },
//   title: {
//     flex: '1 1 100%',
//   },
// }));

const EnhancedTableToolbar = (props) => {
  // const classes = useToolbarStyles();
  // const {numSelected} = props;

  return <Toolbar></Toolbar>;
};

function DataTable({
  data: rows = [],
  headCells,
  t,
  newText,
  buttonText,
  buttonLink,
  actions,
}) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.forEach((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  // const handleClick = (event, name) => {
  //   const selectedIndex = selected.indexOf(name);
  //   let newSelected = [];
  //
  //   if (selectedIndex === -1) {
  //     newSelected = newSelected.concat(selected, name);
  //   } else if (selectedIndex === 0) {
  //     newSelected = newSelected.concat(selected.slice(1));
  //   } else if (selectedIndex === selected.length - 1) {
  //     newSelected = newSelected.concat(selected.slice(0, -1));
  //   } else if (selectedIndex > 0) {
  //     newSelected = newSelected.concat(
  //       selected.slice(0, selectedIndex),
  //       selected.slice(selectedIndex + 1),
  //     );
  //   }
  //
  //   setSelected(newSelected);
  // };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        {rows && rows.length > 0 && (
          <EnhancedTableToolbar numSelected={selected.length} />
        )}
        {rows && rows.length > 0 && (
          <TableContainer>
            <Table className={classes.table} size="small">
              <EnhancedTableHead
                headCells={headCells}
                classes={classes}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length || 0}
              />
              <TableBody>
                {rows && stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, idx) => {
                    console.log('row is:', row);
                    const isItemSelected = isSelected(row.name);
                    // const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        // onClick={event => handleClick(event, row._id)}
                        role="checkbox"
                        tabIndex={-1}
                        key={idx}
                        selected={isItemSelected}>
                        {/*<TableCell padding="checkbox">*/}
                        {/*<Checkbox*/}
                        {/*checked={isItemSelected}*/}
                        {/*inputProps={{ 'aria-labelledby': labelId }}*/}
                        {/*/>*/}
                        {/*</TableCell>*/}
                        {headCells.map((HC, index) => {
                          if (HC.id === 'actions') {
                            return (
                              <TableCell
                                component="td"
                                key={index}
                                scope="row"
                                padding="none">
                                {HC.edit ? (
                                  <Button
                                    outline
                                    theme="info"
                                    size="sm"
                                    onClick={() => HC.editAction(row._id)}>
                                    {/*<i className="material-icons">edit</i>{' '}*/}
                                    {HC.button_text || t('manage post')}
                                  </Button>
                                ) : null}
                                {HC.delete ? (
                                  <Button
                                    outline
                                    theme="danger"
                                    size="sm"
                                    className="ml-2"
                                    onClick={() => HC.deleteAction(row._id)}>
                                    <i className="material-icons">delete</i>{' '}
                                    {t('delete post')}
                                  </Button>
                                ) : null}
                                {actions && actions(row['_id'])}
                              </TableCell>
                            );
                          } else {
                            return (
                              <TableCell
                                component="td"
                                key={index}
                                scope="row"
                                padding="none">
                                <div className={row[HC.id + '_cl']}>
                                  {row[HC.id]}
                                </div>
                              </TableCell>
                            );
                          }
                        })}
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 33 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {rows && rows.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            labelRowsPerPage={t('number per row:')}
            nexticonbuttontext={t('next page')}
            previousiconbuttontext={t('previous page')}
            labelDisplayedRows={({ from, to, count }) =>
              `${from} ${t('to')} ${to === -1 ? count : to} ${t(
                'from'
              )} ${count} ${t('item')}`
            }
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        )}
        {rows && !rows.length && (
          <Alert className="mb-0 p-4">
            <Row>
              <Col lg="8" md="6" sm="12" className={'cebter'}>
                {t(newText)}
              </Col>
              <Col lg="4" md="6" sm="12">
                <Button
                  outline
                  size="sm"
                  theme="light"
                  className="mr-1 text-white font-weight-bold fffs inMobileButton"
                  onClick={() => {
                    if (!buttonLink) {
                      let cc = document.getElementById('ClickOnMeHe');
                      if (cc) cc.click();
                    } else buttonLink();

                    // window.location.replace('/add-new-post');
                  }}>
                  {t(buttonText)}
                </Button>
              </Col>
            </Row>
          </Alert>
        )}
      </Paper>
    </div>
  );
}

export default withTranslation()(DataTable);
