'use client';

import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { useRouter } from 'next/navigation'; // Import useRouter
import { deleteBrand } from '../../services/brandService';
import DeleteBrandDialog from './DeleteBrandDialog';
import BrandDetailModal from './BrandDetailModal'; // Import the new modal component
import AppContext from '../../context/app/AppContext';
import { AppContextType } from '../../interfaces/AppContextType';

interface Brand {
  id: string;
  marca: string;
  titular: string;
  status: string;
  pais_registro: string;
  imagen_url?: string;
  created_at?: string;
  updated_at?: string;
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

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: any },
  b: { [key in Key]: any },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Brand | 'acciones';
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'marca',
    numeric: false,
    disablePadding: true,
    label: 'Marca',
  },
  {
    id: 'titular',
    numeric: false,
    disablePadding: false,
    label: 'Titular',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Estado',
  },
  {
    id: 'pais_registro',
    numeric: false,
    disablePadding: false,
    label: 'País de Registro',
  },
  {
    id: 'imagen_url',
    numeric: false,
    disablePadding: false,
    label: 'Imagen',
  },
  {
    id: 'acciones',
    numeric: false,
    disablePadding: false,
    label: 'Acciones',
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Brand) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof Brand) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'seleccionar todas las marcas',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.id !== 'acciones' ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id as keyof Brand)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'ordenado descendente' : 'ordenado ascendente'}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} seleccionadas
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Listado de Marcas
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Eliminar seleccionadas">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filtrar lista">
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

const BrandList: React.FC<BrandListProps> = ({ brands: initialBrands, onBrandDeleted }) => {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Brand>('marca');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [brandToDeleteId, setBrandToDeleteId] = React.useState<string | null>(null);
  const [openBrandDetailModal, setOpenBrandDetailModal] = React.useState(false); // New state for modal
  const [selectedBrandForModal, setSelectedBrandForModal] = React.useState<Brand | null>(null); // New state for selected brand

  const appCtx = React.useContext<AppContextType | undefined>(AppContext);

  if (!appCtx) {
    throw new Error("BrandList must be used within an AppProvider");
  }

  const { showSnackbar } = appCtx;

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
      const newSelected = initialBrands.map((n) => n.id);
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

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - initialBrands.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      [...initialBrands]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, initialBrands],
  );

  const handleView = (id: string) => {
    const brand = initialBrands.find(b => b.id === id);
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
      // TODO: Show an error message to the user
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
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={initialBrands.length}
            />
            <TableBody>
              {visibleRows.map((brand, index) => {
                const isItemSelected = selected.includes(brand.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={brand.id}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                        onClick={(event) => handleClick(event, brand.id)} 
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {brand.marca}
                    </TableCell>
                    <TableCell align="left">{brand.titular}</TableCell>
                    <TableCell align="left">{brand.status}</TableCell>
                    <TableCell align="left">{brand.pais_registro}</TableCell>
                    <TableCell align="left">
                      {brand.imagen_url ? (
                        <img src={brand.imagen_url} alt={brand.marca} style={{ width: 50, height: 50, objectFit: 'cover' }} />
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell align="left">
                      <Tooltip title="Ver">
                        <IconButton onClick={() => handleView(brand.id)} size="small">
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton onClick={() => handleEdit(brand.id)} size="small">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton onClick={() => handleDelete(brand.id)} size="small">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
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
          count={initialBrands.length}
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
