'use client';

import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useRouter } from 'next/navigation';
import { deleteBrand, Brand } from '../../services/brandService';
import DeleteBrandDialog from './DeleteBrandDialog';
import BrandDetailModal from './BrandDetailModal';
import BrandTableRow from './BrandTableRow';
import BrandTableHead from './BrandTableHead';
import AppContext from '../../context/app/AppContext';
import { AppContextType } from '../../interfaces/AppContextType';

function descendingComparator(a: Brand, b: Brand, orderBy: keyof Brand) {
  if (b[orderBy]! < a[orderBy]!) {
    return -1;
  }
  if (b[orderBy]! > a[orderBy]!) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator(
  order: Order,
  orderBy: keyof Brand,
): (
  a: Brand,
  b: Brand,
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Brand;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'id',
    numeric: false,
    disablePadding: true,
    label: 'ID',
  },
  {
    id: 'marca',
    numeric: false,
    disablePadding: false,
    label: 'Nombre',
  },
  {
    id: 'titular',
    numeric: false,
    disablePadding: false,
    label: 'Propietario',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Status',
  },
  {
    id: 'pais_registro',
    numeric: false,
    disablePadding: false,
    label: 'País de Registro',
  },
];

interface EnhancedTableToolbarProps {
  numSelected: number;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Brands
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

interface BrandListProps {
  brands: Brand[];
  onBrandDeleted: () => void;
}

const BrandList: React.FC<BrandListProps> = ({ brands, onBrandDeleted }) => {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Brand>('id');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [brandToDeleteId, setBrandToDeleteId] = React.useState<string | null>(null);
  const [openBrandDetailModal, setOpenBrandDetailModal] = React.useState(false);
  const [selectedBrandForModal, setSelectedBrandForModal] = React.useState<Brand | null>(null);
  const { showSnackbar } = React.useContext(AppContext as React.Context<AppContextType>);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Brand,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = brands.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - brands.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      [...brands]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, brands],
  );

  const handleView = (id: string) => {
    const brand = brands.find(b => b.id === id);
    if (brand) {
      setSelectedBrandForModal(brand);
      setOpenBrandDetailModal(true);
    }
  };

  const handleCloseBrandDetailModal = () => {
    setOpenBrandDetailModal(false);
    setSelectedBrandForModal(null);
  };

  const router = useRouter();
  const handleEdit = (id: string) => {
    router.push(`/marcas/editar/${id}`);
  };

  const handleConfirmDelete = async (id: string) => {
    try {
      await deleteBrand(id);
      console.log(`Marca con ID ${id} eliminada exitosamente.`);
      showSnackbar(`Marca ${id} eliminada exitosamente.`, 'success');
      setOpenDeleteDialog(false);
      setBrandToDeleteId(null);
      if (onBrandDeleted) {
        onBrandDeleted();
      }
    } catch (error) {
      console.error("Error al eliminar la marca:", error);
    }
  };

  const handleDelete = (id: string) => {
    setBrandToDeleteId(id);
    setOpenDeleteDialog(true);
  };
  
  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            
          >
            <BrandTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={brands.length}
            />
            <TableBody>
              {visibleRows.map((brand, index) => {
                const isItemSelected = selected.includes(brand.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <BrandTableRow
                    key={brand.id}
                    brand={brand}
                    isItemSelected={isItemSelected}
                    labelId={labelId}
                    handleClick={handleClick}
                    handleView={handleView}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                  />
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{}}
                >
                  <TableCell colSpan={headCells.length + 1} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={brands.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          labelRowsPerPage="Marcas por página:"
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
  

      <DeleteBrandDialog
        open={openDeleteDialog}
        brandId={brandToDeleteId}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirmDelete={handleConfirmDelete}
      />

      <BrandDetailModal
        open={openBrandDetailModal}
        onClose={handleCloseBrandDetailModal}
        brand={selectedBrandForModal}
      />
    </Box>
  );
};

export default BrandList;