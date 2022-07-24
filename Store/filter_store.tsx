import create, { SetState, GetState } from "zustand";

interface FilterInterface {
  _id: string | number;
  title: string;
  active?: boolean;
  filter: {
    [key: string]: any;
  };
}

type IProps = {
  filterCount: number;
  ALL_FILTERS: FilterInterface[];
  toogleFilter: (filter: any) => void;
};

const defaultFilters = [
  {
    _id: 1,
    title: "Update -1",
    filter: {
      _updatedOn: -1,
    },
  },
  {
    _id: 2,
    title: "Update 1",
    active: true,
    filter: {
      _updatedOn: 1,
    },
  },
  {
    _id: 3,
    title: "A-Z",
    filter: {
      title: 1,
    },
  },
  {
    _id: 4,
    title: "Z-A",
    filter: {
      title: -1,
    },
  },
];

const defaultFilterCount = defaultFilters.reduce((acc, { active }) => {
  return acc + (active ? 1 : 0);
}, 0);

const FilterStore = (set: SetState<IProps>, get: GetState<IProps>): IProps => ({
  filterCount: defaultFilterCount,
  ALL_FILTERS: defaultFilters,
  toogleFilter: (filter: any) => {
    set(({ ALL_FILTERS }) => {
      let filterCount = 0;
      ALL_FILTERS = ALL_FILTERS.map((item) => {
        if (item._id === filter._id) {
          item.active = !item.active;
        }
        if (item.active) {
          filterCount += 1;
        }
        return item;
      });
      return { ALL_FILTERS, filterCount };
    });
  },
});

export const useFilterStore = create<IProps>(FilterStore);
