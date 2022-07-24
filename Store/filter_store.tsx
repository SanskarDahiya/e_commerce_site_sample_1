import create, { SetState, GetState } from "zustand";

interface FilterInterface {
  _id: string | number;
  title: string;
  active?: boolean;
  filter?: {
    [key: string]: any;
  };
  sort?: {
    [key: string]: any;
  };
}

type IProps = {
  activeFilter: any;
  filterCount: number;
  ALL_FILTERS: FilterInterface[];
  toogleFilter: (filter: any) => void;
  getActiveFilters: () => any;
};

const defaultFilters = [
  {
    _id: 1,
    title: "Update -1",
    sort: {
      _updatedOn: -1,
      _id: 1,
    },
  },
  {
    _id: 2,
    title: "Update 1",
    active: false,
    sort: {
      _updatedOn: 1,
      _id: 1,
    },
  },
  {
    _id: 3,
    title: "A-Z",
    sort: {
      title: 1,
      _id: 1,
    },
  },
  {
    _id: 4,
    title: "Z-A",
    sort: {
      title: -1,
      _id: 1,
    },
  },
];

const defaultFilterCount = defaultFilters.reduce((acc, { active }) => {
  return acc + (active ? 1 : 0);
}, 0);

const FilterStore = (set: SetState<IProps>, get: GetState<IProps>): IProps => ({
  activeFilter: {
    filter: null,
    sort: null,
  },
  filterCount: defaultFilterCount,
  ALL_FILTERS: defaultFilters,
  getActiveFilters: () => {
    return get().activeFilter;
  },
  toogleFilter: (filter: any) => {
    set(({ ALL_FILTERS, activeFilter }) => {
      let filterCount = 0;
      activeFilter["filter"] = null;
      activeFilter["sort"] = null;
      ALL_FILTERS = ALL_FILTERS.map((item) => {
        if (item._id === filter._id) {
          item.active = !item.active;
        }
        if (item.active) {
          filterCount += 1;
          if (filter.filter) {
            activeFilter["filter"] = activeFilter["filter"] || {};
            activeFilter["filter"] = {
              ...item.filter,
              ...activeFilter["filter"],
            };
          }
          if (filter.sort) {
            activeFilter["sort"] = activeFilter["sort"] || {};
            activeFilter["sort"] = {
              ...item.sort,
              ...activeFilter["sort"],
            };
          }
        }
        return item;
      });
      return { ALL_FILTERS, filterCount, activeFilter: { ...activeFilter } };
    });
  },
});

export const useFilterStore = create<IProps>(FilterStore);
