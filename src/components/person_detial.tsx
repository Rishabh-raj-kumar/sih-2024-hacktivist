import React from 'react';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import { motion } from 'framer-motion';

const PersonDetail = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full w-full flex flex-col"
    >
      <TableContainer className="overflow-y-auto flex-1">
        <Table stickyHeader>
          <TableHead>
          <TableRow>
              <TableCell component="th" scope="row">
                Image
              </TableCell>
              <TableCell>
                <img
                  src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c"
                  alt="missing person"
                  className="w-48 h-48 rounded"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Detail</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                Name
              </TableCell>
              <TableCell>Rishabh Raj</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Age
              </TableCell>
              <TableCell>25</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Gender
              </TableCell>
              <TableCell>Male</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Contact
              </TableCell>
              <TableCell>9876543210</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Location
              </TableCell>
              <TableCell>Ujjain</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Description
              </TableCell>
              <TableCell>
                Wearing orange kurta and white dhoti. Has a small scar on right hand.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </motion.div>
  );
};

export default PersonDetail;
