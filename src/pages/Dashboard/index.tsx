import { useState, useEffect } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

export interface FoodDTO {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}

interface StateDTO {
  foods: FoodDTO[];
  editingFood?: FoodDTO;
  modalOpen?: boolean;
  editModalOpen?: boolean;
}

const Dashboard = () => {
  const [state, setState] = useState<StateDTO>({
    foods: [],
    editingFood: {} as FoodDTO,
    modalOpen: false,
    editModalOpen: false,
  })
  useEffect(()=>{
    (async function loadFoods() {
      const response = await api.get<FoodDTO[]>('/foods');
      setState({ foods: response.data });
    })()
  },[])


  async function handleAddFood (food: FoodDTO): Promise<void> {
    const { foods } = state;

    try {
      const response = await api.post<FoodDTO>('/foods', {
        ...food,
        available: true,
      });

      setState({ foods: [...foods, response.data] });
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood (food: FoodDTO): Promise<void> {
    const { foods, editingFood } = state;

    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood?.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setState({ foods: foodsUpdated });
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood (id: number) {
    const { foods } = state;

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setState({ foods: foodsFiltered });
  }

  function toggleModal () {
    const { modalOpen } = state;
    setState({ ...state, modalOpen: !modalOpen });
  }

  function toggleEditModal () {
    const { editModalOpen } = state;

    setState({ ...state, editModalOpen: !editModalOpen });
  }

  function handleEditFood (food: FoodDTO) {
    setState({ ...state, editingFood: food, editModalOpen: true });
  }

  const { modalOpen, editModalOpen, editingFood, foods } = state;

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
