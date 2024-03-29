import "./PageNavBar.scss";
import { PageList } from "./components/PageList/PageList";
import { PageSwitch } from "./components/PageSwitch/PageSwitch";
import { PageFilter } from "./components/PageFilter/PageFilter";

interface IPageNavBarProps {
  filter?: boolean;
  filterOptions?: IFilterOptions[];
  page?: boolean;
  maxPage?: number;
}

export interface IFilterOptions {
  tag: string;
  caption: string;
}

export const PageNavBar: React.FC<IPageNavBarProps> = ({
  filter = false,
  page = false,
  maxPage = 0,
  filterOptions = [{ tag: "last-date-create", caption: "Дата создания" }],
}) => {
  if (!filter && (!page || maxPage <= 1)) return <div></div>;
  return (
    <div className="page-nav-bar">
      {page && maxPage > 0 && <PageList maxPage={maxPage} />}
      {page && maxPage > 0 && <PageSwitch maxPage={maxPage} />}
      {filter && <PageFilter filterOptions={filterOptions} />}
    </div>
  );
};
