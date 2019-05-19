import com.sun.source.util.Trees;
import com.sun.tools.javac.processing.JavacProcessingEnvironment;
import com.sun.tools.javac.tree.JCTree;
import com.sun.tools.javac.tree.TreeMaker;
import com.sun.tools.javac.util.Context;
import com.sun.tools.javac.util.Names;

import javax.annotation.processing.*;
import javax.lang.model.SourceVersion;
import javax.lang.model.element.Element;
import javax.lang.model.element.TypeElement;
import javax.tools.Diagnostic;
import java.util.Set;

@SupportedAnnotationTypes({"Data"})
@SupportedSourceVersion(SourceVersion.RELEASE_8)
public class DataProcessor extends AbstractProcessor {
    /**
     * 语法树
     */
    private Trees trees;

    /**
     * 树节点创建工具类
     */
    private TreeMaker treeMaker;

    /**
     * 命名工具类
     */
    private Names names;

    private Messager messager;

    @Override
    public synchronized void init(ProcessingEnvironment processingEnv) {
        super.init(processingEnv);
        this.messager = processingEnv.getMessager();
        this.trees = Trees.instance(processingEnv);
        Context context = ((JavacProcessingEnvironment) processingEnv).getContext();
        this.treeMaker = TreeMaker.instance(context);
        this.names = Names.instance(context);
    }

    @Override
    public boolean process(Set<? extends TypeElement> annotations, RoundEnvironment roundEnv) {
        if (!roundEnv.processingOver()) {
            messager.printMessage(Diagnostic.Kind.NOTE, "-----开始自动生成源代码");
            Set<? extends Element> elements = roundEnv.getElementsAnnotatedWith(Data.class);
            for (Element element : elements) {
                if (element.getKind().isClass() && element instanceof TypeElement) {
                    messager.printMessage(Diagnostic.Kind.NOTE, "开始分析", element);
                    // 获取语法树
                    JCTree tree = (JCTree) trees.getTree(element);
                    System.out.println(tree);
                    // 使用TreeTranslator遍历
                    tree.accept(new DataTreeTranslator(treeMaker, names));
                }
            }
            messager.printMessage(Diagnostic.Kind.NOTE, "-----完成自动生成源代码");
        }
        return true;
    }
}
