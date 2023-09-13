enum PaymentMethod {
  CARD,
}

type Props = {
  soldAt: Date;
  issuedAt: Date;
  updatedAt: Date;
  paymentMethod: PaymentMethod;
  discount: number;
  recipentEmail: string;
  products: Array<object>;
};

const History = (props: Props) => {
  return <div>History</div>;
};

export default History;
