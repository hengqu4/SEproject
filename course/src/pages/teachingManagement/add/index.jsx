import TableExpand from './TableExpand';
import { Card } from 'antd';
import DrawerFormInDrawer from './DrawerFormInDrawer';
export default function() {
  return (
    <div>
      <Card bordered={false} extra={<DrawerFormInDrawer />}>
        <TableExpand />
      </Card>
      
    </div>
  );
}
