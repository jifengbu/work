import com.sun.tools.javac.code.Flags;
import com.sun.tools.javac.code.Type;
import com.sun.tools.javac.code.TypeTag;
import com.sun.tools.javac.tree.JCTree;
import com.sun.tools.javac.tree.JCTree.*;
import com.sun.tools.javac.tree.TreeMaker;
import com.sun.tools.javac.tree.TreeTranslator;
import com.sun.tools.javac.util.List;
import com.sun.tools.javac.util.Names;

public class DataTreeTranslator extends TreeTranslator {

    private TreeMaker treeMaker;
    private Names names;

    /**
     * 需要插入的Getter和Setter方法
     */
    private List<JCTree> getters = List.nil();
    private List<JCTree> setters = List.nil();

    public DataTreeTranslator(TreeMaker treeMaker, Names names) {
        this.treeMaker = treeMaker;
        this.names = names;
    }

    /**
     * 遍历到类的时候执行
     */
    @Override
    public void visitClassDef(JCClassDecl jcClassDecl) {
        super.visitClassDef(jcClassDecl);
        // 插入getter方法
        if (!getters.isEmpty()) {
            jcClassDecl.defs = jcClassDecl.defs.appendList(this.getters);
        }
        // 插入setter方法
        if (!setters.isEmpty()) {
            jcClassDecl.defs = jcClassDecl.defs.appendList(this.setters);
        }
        this.result = jcClassDecl;
    }

    /**
     * 遍历成员遍历，参数等等
     */
    @Override
    public void visitVarDef(JCVariableDecl jcVariableDecl) {
        super.visitVarDef(jcVariableDecl);
        // 下面只是简单处理, 不考虑是否存在等等
        // 生成getter方法
        JCMethodDecl getterMethod = createGetterMethod(jcVariableDecl);
        this.getters = this.getters.append(getterMethod);
        // 生成getter方法
        JCMethodDecl setterMethod = createSetterMethod(jcVariableDecl);
        this.setters = this.setters.append(setterMethod);
    }

    /**
     * 生成Getter节点
     */
    private JCMethodDecl createGetterMethod(JCVariableDecl field) {
        return treeMaker.MethodDef(
                // public方法
                treeMaker.Modifiers(Flags.PUBLIC),
                // 方法名称
                names.fromString("get" + this.toTitleCase(field.getName().toString())),
                // 方法返回的类型
                (JCExpression) field.getType(),
                // 泛型参数
                List.nil(),
                // 方法参数
                List.nil(),
                // throw表达式
                List.nil(),
                // 方法体
                treeMaker.Block(0L, List.of(treeMaker.Return(treeMaker.Select(treeMaker.Ident(names.fromString("this")), names.fromString(field.getName().toString()))))),
                // 默认值
                null
        );
    }

    /**
     * 创建Setter方法
     */
    private JCMethodDecl createSetterMethod(JCVariableDecl field) {
        // 定义方法传入的参数
        JCVariableDecl param = treeMaker.VarDef(treeMaker.Modifiers(Flags.PARAMETER), field.name, field.vartype, null);
        // 方法体, 为: this.xxx = xxx;
        JCFieldAccess thisX = treeMaker.Select(treeMaker.Ident(names.fromString("this")), field.name);
        JCAssign assign = treeMaker.Assign(thisX, treeMaker.Ident(field.name));
        JCIf cond = treeMaker.If(
                treeMaker.Parens(
                        treeMaker.Binary(
                                Tag.NE,
                                treeMaker.Literal(TypeTag.BOT, null),
                                treeMaker.Ident(field.name)
                        )
                ),
                treeMaker.Block(0L, List.of(treeMaker.Exec(assign))),
                null
        );
        JCBlock methodBody = treeMaker.Block(0L, List.of(cond));

        return treeMaker.MethodDef(
                // public方法
                treeMaker.Modifiers(Flags.PUBLIC),
                // 方法名称
                names.fromString("set" + this.toTitleCase(field.getName().toString())),
                // 方法返回的类型
                treeMaker.Type(new Type.JCVoidType()),
                // 泛型参数
                List.nil(),
                // 方法参数
                List.of(param),
                // throw表达式
                List.nil(),
                // 方法体
                methodBody,
                // 默认值
                null
        );
    }

    /**
     * 首字母大写
     */
    public String toTitleCase(String str) {
        char first = str.charAt(0);
        if (first >= 'a' && first <= 'z') {
            first -= 32;
        }
        return first + str.substring(1);
    }
}