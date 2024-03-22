// import React, { useContext, useEffect, useState } from "react";
import React, { useContext, useState } from "react";
import { Context } from "../../index";
// import CategoriesService from "../../services/CategoriesService";
import CategoriesPanel from "../CategoriesPanel/CategoriesPanel";
import styles from "./Root.module.css";
import Board from "../Board/Board";
import { useNavigate } from "react-router-dom";



function Root() {

  // const [categories, setCategories] = useState([]);
  const { store } = useContext(Context);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const navigate = useNavigate();


  // useEffect(() => {
  //   async function fetchAndSetCategories() {
  //     store.setLoading(true);
  //     try {
  //       const response = await CategoriesService.GetAll();
  //       setCategories(response.data.data);
  //     } catch (error) {
  //       console.error("Ошибка при загрузке категорий:", error);
  //       // Обработка ошибок, например, показ сообщения пользователю
  //     }
  //     store.setLoading(false);
  //   }
  //   fetchAndSetCategories();
  // }, [store]);

  if (store.loading) {
    return <div>Loading...</div>; // Или компонент индикатора загрузки
  }

  // console.log(`Categories: ${categories}`);
  // console.log(`Categories[0]: ${categories[0]}`);

  return (
    
    <div className={styles.boardContainer}>
      
      <div className={styles.categoriesPanel}>
        <CategoriesPanel
          selectedCategoryId={selectedCategoryId}
          setSelectedCategoryId={setSelectedCategoryId}
        //  categories={categories}
        //  setCategories={setCategories}
        />
      </div>


      <Board selectedCategoryId={store.getCategory()}/>
      <button className={styles["logout_button"]} onClick={() => {
        store.logout();
        navigate("/login");
      }}>Logout</button>
      {/*{categories.map(category => (*/}
      {/*    <div key={category.id}>*/}
      {/*        <h2>{category.name}</h2>*/}
      {/*    </div>*/}
      {/*))}*/}
    </div>
  );
}

export default Root;
