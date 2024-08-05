import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../app/hooks";
import { addCompany, deleteCompany, getData, saveChanges } from "./tableSlice";
import { MdOutlineEdit } from "react-icons/md";
import { FaRegSave } from "react-icons/fa";
import Table from "@mui/material/Table";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Paper,
  Stack,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
} from "@mui/material";
import styles from "./Table.module.css";
import { dataInterface } from "./tableTypes";
import { visuallyHidden } from "@mui/utils";

interface HeadCellInterface {
  id: keyof dataInterface;
  label: string;
}

const headCell: readonly HeadCellInterface[] = [
  {
    id: "company",
    label: "Название компании",
  },
  {
    id: "address",
    label: "Адресс",
  },
];

function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  /* stabilizedThis.sort((a: any, b: any) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }

    return a[1] - b[1];
  }); */
  return stabilizedThis.map((el) => el[0]);
}
function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const TableP = () => {
  const data = useSelector(getData);
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({ company: "", address: "" });
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof dataInterface>("company");
  const [validData, setValidData] = useState(true);
  const [activeAddMode, setActiveAddMode] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<readonly number[]>([]);
  const [activeEditMode, setActiveEditMode] = useState<Record<string, boolean>>(
    () => {
      const initialCheckedState: Record<string, boolean> = {};
      data.forEach(
        (item) => (
          (initialCheckedState[item.company] = false),
          (initialCheckedState[item.address] = false)
        )
      );
      return initialCheckedState;
    }
  );
  const [inputValue, setInputValue] = useState<Record<string, string>>(() => {
    const initialState: Record<string, string> = {};
    data.forEach((item) => ({
      company: initialState[item.company],
      address: initialState[item.address],
    }));
    return initialState;
  });

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data?.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof dataInterface
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const createSortHandler =
    (property: keyof dataInterface) => (event: React.MouseEvent<unknown>) => {
      handleRequestSort(event, property);
    };

  // Кнопка измененения поля компании
  const handleActiveEditMode = async (
    value: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    setInputValue(() => {
      e.preventDefault();
      const initialState: Record<string, string> = {};
      data.forEach((item) => (initialState[item.company] = item.company));
      data.forEach((item) => (initialState[item.address] = item.address));
      return initialState;
    });

    setActiveEditMode({
      ...activeEditMode,
      [value]: true,
    });
  };

  //Изменение инпута
  const handleChangeInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInputValue({
      ...inputValue,
      [e.target.id]: e.currentTarget.value,
    });
  };

  //Кнопка сохранения поля компании
  const handleSaveChanges = (
    e: React.MouseEvent<HTMLButtonElement>,
    oldValue: string,
    id: number,
    field: string
  ) => {
    e.preventDefault();

    dispatch(saveChanges({ id, value: inputValue[oldValue], field }));
    setActiveEditMode({
      ...activeEditMode,
      [oldValue]: false,
    });
  };

  //Кнопка активации формы для добавления компании
  const handleActiveAddMode = () => {
    setFormData({ company: "", address: "" });
    setActiveAddMode(true);
  };

  //Обновление формы при добавлении компании
  const updateFormData = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //Кнопка добавления компании
  const handleSumbitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.company.length !== 0 && formData.address.length !== 0) {
      dispatch(addCompany(formData));
      setActiveAddMode(false);
      setValidData(true);
    } else {
      setValidData(false);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(data, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [data, page, rowsPerPage, order, orderBy]
  );

  useEffect(() => {
    if (emptyRows === 5 || emptyRows === 10) {
      setPage(page - 1);
    }
  }, [emptyRows]);

  // Кнопка "Удалить выбранные компании"
  const handleDeleteCompany = (e: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(deleteCompany(selected));
    setSelected([]);
  };

  return (
    <>
      {activeAddMode ? (
        <div className={styles.activeAddMode}>
          <div className={styles.formTitleWrapper}>
            <h2 className={styles.formTitle}>Добавить компанию</h2>
            <Button onClick={() => setActiveAddMode(false)}>Назад</Button>
          </div>
          {validData ? null : (
            <div className={styles.validForm}>
              Проверьте, возможно вы не заполнили поля!
            </div>
          )}
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { mb: 3, width: "25ch" },
              display: "flex",
              flexDirection: "column",
            }}
            noValidate
            autoComplete="off"
            action="form"
            onSubmit={(e) => handleSumbitForm(e)}
          >
            <TextField
              label="Название компании"
              id="outlined-size-small"
              name="company"
              defaultValue=""
              size="small"
              onChange={(e) => updateFormData(e)}
            />
            <TextField
              label="Адрес компании"
              id="outlined-size-small"
              name="address"
              defaultValue=""
              size="small"
              onChange={(e) => updateFormData(e)}
            />
            <Button
              type="submit"
              variant="contained"
              className={styles.formButton}
              color="success"
            >
              Добавить
            </Button>
          </Box>
        </div>
      ) : (
        <Box>
          <Stack
            direction="row"
            spacing={2}
            sx={{ mb: 3, justifyContent: "end" }}
          >
            <Button
              type="button"
              variant="contained"
              className={styles.addButton}
              onClick={() => handleActiveAddMode()}
              color="success"
            >
              Добавить компанию
            </Button>
            <Button
              type="button"
              variant="contained"
              onClick={(e) => handleDeleteCompany(e)}
              color="error"
            >
              Удалить выбранные компании
            </Button>
          </Stack>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={
                            data.length > 0 && selected.length === data.length
                          }
                          id="all"
                          onChange={(e) => handleSelectAllClick(e)}
                          color="secondary"
                          size="small"
                        />
                      }
                      label="Выделить все"
                    />
                  </TableCell>
                  {headCell.map((row) => (
                    <TableCell
                      key={row.id}
                      align="center"
                      sortDirection={orderBy === row.id ? order : false}
                    >
                      <TableSortLabel
                        active={orderBy === row.id}
                        direction={orderBy === row.id ? order : "asc"}
                        onClick={createSortHandler(row.id)}
                      >
                        {row.label}
                        {orderBy === row.id ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === "desc"
                              ? "sorted descending"
                              : "sorted ascending"}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              {visibleRows?.length !== 0 ? (
                <TableBody>
                  {visibleRows?.map(({ company, address, id }, index) => {
                    const isItemSelected = isSelected(id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        key={id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          cursor: "pointer",
                        }}
                        role="checbox"
                        aria-checked={isItemSelected}
                        selected={isItemSelected}
                        onClick={(e) => null}
                        hover
                        tabIndex={-1}
                      >
                        <TableCell component="th" scope="row">
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={isItemSelected}
                                onChange={(e) => handleSelect(e, id)}
                                name={company}
                                id={id.toString()}
                                color="success"
                                size="small"
                                inputProps={{
                                  "aria-labelledby": labelId,
                                }}
                              />
                            }
                            label={`${id} .Выбрать`}
                          />
                        </TableCell>
                        <TableCell align="center" style={{ fontSize: 18 }}>
                          {activeEditMode[company] ? (
                            <TextField
                              id={company}
                              value={inputValue[company]}
                              name={"company"}
                              onChange={(e) => handleChangeInput(e)}
                              size="small"
                              label="Company"
                            />
                          ) : (
                            company
                          )}
                          {activeEditMode[company] ? (
                            <IconButton
                              aria-label="delete"
                              id={company}
                              onClick={(e) =>
                                handleSaveChanges(e, company, id, "company")
                              }
                              sx={{ float: "right" }}
                            >
                              <FaRegSave />
                            </IconButton>
                          ) : (
                            <IconButton
                              aria-label="delete"
                              id={company}
                              onClick={(e) => handleActiveEditMode(company, e)}
                              sx={{ float: "right" }}
                            >
                              <MdOutlineEdit fontSize={"inherit"} />
                            </IconButton>
                          )}
                        </TableCell>
                        <TableCell align="center" style={{ fontSize: 18 }}>
                          {activeEditMode[address] ? (
                            <TextField
                              id={address}
                              value={inputValue[address]}
                              onChange={(e) => handleChangeInput(e)}
                              size="small"
                              label="Address"
                            />
                          ) : (
                            address
                          )}
                          {activeEditMode[address] ? (
                            <IconButton
                              aria-label="delete"
                              id={address}
                              onClick={(e) =>
                                handleSaveChanges(e, address, id, "address")
                              }
                              sx={{ float: "right" }}
                            >
                              <FaRegSave />
                            </IconButton>
                          ) : (
                            <IconButton
                              aria-label="delete"
                              id={address}
                              onClick={(e) => handleActiveEditMode(address, e)}
                              sx={{ float: "right" }}
                            >
                              <MdOutlineEdit />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              ) : (
                <div className={styles.empty}>
                  Здесь пусто. Добавьте компанию
                </div>
              )}
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      )}
    </>
  );
};

export default TableP;
