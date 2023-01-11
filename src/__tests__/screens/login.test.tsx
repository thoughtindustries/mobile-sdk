import renderer from "react-test-renderer";
import Login from "../../screens/Login";

it("login snapshot test", () => {
  const tree = renderer.create(<Login />).toJSON();
  expect(tree).toMatchSnapshot();
});
