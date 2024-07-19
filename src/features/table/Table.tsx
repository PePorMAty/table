import { useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../app/hooks";
import { addCompany, deleteCompany, getData, saveChanges } from "./tableSlice";
import { MdOutlineEdit } from "react-icons/md";
import { FaRegSave } from "react-icons/fa";
import styles from "./Table.module.css";

const Table = () => {
  const data = useSelector(getData);
  const dispatch = useAppDispatch();
  const [isAllChecked, setIsAllChecked] = useState<boolean>(false);
  const [formData, setFormData] = useState({ company: "", address: "" });
  const [validData, setValidData] = useState(true);
  const [activeAddMode, setActiveAddMode] = useState(false);

  const [isChecked, setIsChecked] = useState<Record<string, boolean>>(() => {
    const initialCheckedState: Record<string, boolean> = {};
    data.forEach((item) => (initialCheckedState[item.id] = false));
    return initialCheckedState;
  });
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
    data.forEach(
      (item) => (
        (initialState[item.company] = item.company),
        (initialState[item.address] = item.address)
      )
    );
    return initialState;
  });

  // Кнопка "Выделить все"
  const handleActiveAllCheckboxes = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsAllChecked(e.target.checked);

    const updatedCheckedState = data.reduce((acc, curr) => {
      acc[curr.id] = e.target.checked;
      return acc;
    }, isChecked);

    setIsChecked(updatedCheckedState);
  };

  // Кнопка "Выбрать"
  const handleActiveCheckBox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked({
      ...isChecked,
      [e.target.id]: e.target.checked,
    });
  };

  // Кнопка "Удалить выбранные компании"
  const handleDeleteCompany = (e: React.MouseEvent<HTMLButtonElement>) => {
    const selectedIds = Object.entries(isChecked)
      .filter(([, checked]) => checked)
      .map(([id]) => parseInt(id));

    dispatch(deleteCompany(selectedIds));
    setIsAllChecked(false);
  };

  // Кнопка измененения поля компании
  const handleActiveEditMode = async (value: string) => {
    setInputValue(() => {
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
  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setIsChecked(() => {
      const initialCheckedState: Record<string, boolean> = {};
      data.forEach((item) => (initialCheckedState[item.id] = false));
      return initialCheckedState;
    });
  };

  //Обновление формы при добавлении компании
  const updateFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <>
      {activeAddMode ? (
        <div className={styles.activeAddMode}>
          <div className={styles.formTitleWrapper}>
            <h2 className={styles.formTitle}>Добавить компанию</h2>
            <button
              className={styles.cancelButton}
              onClick={() => setActiveAddMode(false)}
            >
              Назад
            </button>
          </div>
          {validData ? null : (
            <div className={styles.validForm}>
              Проверьте, возможно вы не заполнили поля!
            </div>
          )}
          <form
            className={styles.form}
            action="form"
            onSubmit={(e) => handleSumbitForm(e)}
          >
            <label className={styles.formLabel} htmlFor="companyName">
              Название Компании
            </label>
            <input
              className={styles.formInput}
              type="text"
              id="companyName"
              placeholder="Название компании"
              name="company"
              onChange={(e) => updateFormData(e)}
            />
            <label className={styles.formLabel} htmlFor="companyAddress">
              Адрес компании
            </label>
            <input
              className={styles.formInput}
              type="text"
              id="companyAddress"
              placeholder="Адрес компании"
              name="address"
              onChange={(e) => updateFormData(e)}
            />
            <button className={styles.formButton} type="submit">
              Добавить
            </button>
          </form>
        </div>
      ) : (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    id="all"
                    checked={isAllChecked}
                    onChange={(e) => handleActiveAllCheckboxes(e)}
                  />
                  <label htmlFor="all">Выделить все</label>
                </th>
                <th>Название компании</th>
                <th>Адрес</th>
              </tr>
            </thead>
            {data.length !== 0 ? (
              <tbody>
                {data?.map(({ id, company, address }: any, index: any) => (
                  <tr key={id}>
                    <td
                      className={
                        isChecked[id]
                          ? `${styles.checked}`
                          : `${styles.notChecked}`
                      }
                    >
                      <input
                        type="checkbox"
                        id={id.toString()}
                        name={company}
                        checked={isChecked[id]}
                        onChange={(e) => handleActiveCheckBox(e)}
                      />
                      <label htmlFor={id.toString()}>
                        {index + 1}. Выбрать
                      </label>
                    </td>
                    <td
                      className={
                        isChecked[id]
                          ? `${styles.checked}`
                          : `${styles.notChecked}`
                      }
                    >
                      {activeEditMode[company] ? (
                        <input
                          type="text"
                          id={company}
                          value={inputValue[company]}
                          onChange={(e) => handleChangeInput(e)}
                        />
                      ) : (
                        <>{company}</>
                      )}
                      {activeEditMode[company] ? (
                        <button
                          id={company}
                          className={styles.tableIcon}
                          onClick={(e) =>
                            handleSaveChanges(e, company, id, "company")
                          }
                        >
                          <FaRegSave />
                        </button>
                      ) : (
                        <button
                          id={company}
                          className={styles.tableIcon}
                          onClick={(e) => handleActiveEditMode(company)}
                        >
                          <MdOutlineEdit />
                        </button>
                      )}
                    </td>
                    <td
                      className={
                        isChecked[id]
                          ? `${styles.checked}`
                          : `${styles.notChecked}`
                      }
                    >
                      {activeEditMode[address] ? (
                        <input
                          type="text"
                          id={address}
                          value={inputValue[address]}
                          onChange={(e) => handleChangeInput(e)}
                        />
                      ) : (
                        <>{address}</>
                      )}
                      {activeEditMode[address] ? (
                        <button
                          id={id}
                          className={styles.tableIcon}
                          onClick={(e) =>
                            handleSaveChanges(e, address, id, "address")
                          }
                        >
                          <FaRegSave />
                        </button>
                      ) : (
                        <button
                          id={id}
                          className={styles.tableIcon}
                          onClick={(e) => handleActiveEditMode(address)}
                        >
                          <MdOutlineEdit />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <div className={styles.empty}>Здесь пусто. Добавьте компанию</div>
            )}
          </table>
          <div className={styles.buttons}>
            <button
              type="button"
              className={styles.deleteButton}
              onClick={(e) => handleDeleteCompany(e)}
            >
              Удалить выбранные компании
            </button>
            <button
              type="button"
              className={styles.addButton}
              onClick={() => handleActiveAddMode()}
            >
              Добавить компанию
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default Table;
